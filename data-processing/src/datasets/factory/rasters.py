"""
This module contains the get_raster_layer method, which is responsible for creating
raster layer objects based on the type of raster layer requested.
"""

from pathlib import Path

import gcsfs
import xarray as xr
from animations.animated_tiles import AnimatedTiles
from animations.utils import create_linear_segmented_colormap
from helpers.raster_processor import QgsStyledRasterProcessor
from helpers.raster_tiles import RasterTiles


# Factory for creating raster layers
class _RasterLayerFactory:
    def __init__(self):
        self._raster_layer_types = {"Zarr": ZarrRasterLayer, "GeoTIFF": GeoTIFFRasterLayer}

    def get_raster_type(self, format_type):
        raster_layer = self._raster_layer_types.get(format_type)
        if not format_type:
            raise ValueError(f"Type {format_type} not found.")
        return raster_layer()


# Zarr raster layer implementation
class ZarrRasterLayer:
    """
    Represents a Zarr raster layer.
    """

    TILE_PATH = Path("../data/processed/AnimatedTiles")

    def load_data(self, url):
        """
        Loads the data from the base URL.
        """
        print(f"Loading Zarr data from {url}...")
        fs = gcsfs.GCSFileSystem(token="anon")
        store = fs.get_mapper(url)
        ds = xr.open_zarr(store=store, consolidated=True)
        return ds

    def process(self, data, styles, file_name):
        """
        Process the raster data.
        """
        # Create Animated Tiles Folder
        output_folder = ZarrRasterLayer.TILE_PATH / Path(file_name)
        output_folder.mkdir(parents=True, exist_ok=True)

        # xr.Dataset to xr.DataArray
        var = list(data.data_vars)[0]
        da = data[var].rio.write_crs("EPSG:4326")

        # Create Color Map
        colors_list = styles.get("colors")
        cm = create_linear_segmented_colormap(colors_list)

        # Convert xarray to Animated Tiles
        animater_tiles = AnimatedTiles(
            da,
            output_folder,
            min_z=4,
            max_z=12,
            color_map=cm,
            vmin=styles.get("vmin"),
            vmax=styles.get("vmax"),
        )
        animater_tiles.create(time_coord=styles.get("time_coord"))


# GeoTIFF raster layer implementation
class GeoTIFFRasterLayer:
    """
    Represents a GeoTIFF raster layer
    """

    RASTER_PATH = Path("../data/processed/RasterLayers")
    RASTER_TILE_PATH = Path("../data/processed/RasterTiles")

    def load_data(self, url):
        """
        Loads the data from the base URL.
        """
        print(f"Loading GeoTIFF data from {url}...")
        ds = xr.open_dataset(url, engine="rasterio")
        return ds

    def process(self, url, styles, file_name):
        """
        Process the raster data.
        """
        # Style raster and save it as Cloud Optimized GeoTIFF
        output_path = GeoTIFFRasterLayer.RASTER_PATH / Path(file_name).with_suffix(".tif")
        QgsStyledRasterProcessor(url, styles, output_path).process()

        # Create Raster Tiles Folder
        output_folder = GeoTIFFRasterLayer.RASTER_TILE_PATH / Path(file_name)
        output_folder.mkdir(parents=True, exist_ok=True)

        # Convert GeoTIFF to Tiles
        raster_tiles = RasterTiles(output_path, output_folder, min_z=4, max_z=12, engine="rasterio")
        raster_tiles.create()


raster_layer_factory = _RasterLayerFactory()


def get_raster_layer(format_type):
    """
    Returns a raster layer of the given format.
    """
    return raster_layer_factory.get_raster_type(format_type)
