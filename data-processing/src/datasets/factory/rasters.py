"""
This module contains the get_raster_layer method, which is responsible for creating
raster layer objects based on the type of raster layer requested.
"""

import gcsfs
import xarray as xr


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

    def load_data(self, url):
        """
        Loads the data from the base URL.
        """
        print(f"Loading Zarr data from {url}...")
        fs = gcsfs.GCSFileSystem(token="anon")
        store = fs.get_mapper(url)
        ds = xr.open_zarr(store=store, consolidated=True)
        return ds


# GeoTIFF raster layer implementation
class GeoTIFFRasterLayer:
    """
    Represents a GeoTIFF raster layer
    """

    def load_data(self, url):
        """
        Loads the data from the base URL.
        """
        print(f"Loading GeoTIFF data from {url}...")
        ds = xr.open_dataset(url, engine="rasterio")
        return ds


raster_layer_factory = _RasterLayerFactory()


def get_raster_layer(format_type):
    """
    Returns a raster layer of the given format.
    """
    return raster_layer_factory.get_raster_type(format_type)
