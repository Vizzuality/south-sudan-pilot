"""
Module for creating animated tiles
"""

import io
import os
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

import mercantile
import numpy as np
import rasterio
import xarray as xr
from PIL import Image
from rio_tiler.colormap import ColorMapType
from rio_tiler.errors import TileOutsideBounds
from rio_tiler.io import Reader, XarrayReader
from tqdm import tqdm
from utils import create_apngs, get_files_with_years


class AnimatedTiles:
    """
    Class for creating animated tiles.

    Attributes:
    data (str or xarray.DataArray): The data to be animated.
    output_folder (str): The name of the local folder where the animated tiles will be exported.
    min_z (int, optional): The minimum zoom level. Defaults to 0.
    max_z (int, optional): The maximum zoom level. Defaults to 12.
    color_map (rio_tiler.colormap.ColorMapType, optional): The colormap to use. Defaults to None.
    vmin (float, optional): The minimum value for the colormap. Defaults to 0.
    vmax (float, optional): The maximum value for the colormap. Defaults to 30000.
    engine (str, optional): The engine to use. Defaults to "xarray".
    """

    def __init__(
        self,
        data,
        output_folder: Path,
        min_z: int = 0,
        max_z: int = 12,
        color_map: ColorMapType = None,
        vmin: float = 0,
        vmax: float = 30000,
        engine: str = "xarray",
    ):
        """
        Initializes the AnimatedTiles class.
        """
        self.engine = engine
        self.engine_class = {"xarray": XArrayEngine, "rasterio": RasterioEngine}.get(engine)
        if not self.engine_class:
            raise ValueError(f"Unsupported engine: {engine}")
        self.engine_instance = self.engine_class(
            data, output_folder, min_z, max_z, color_map, vmin, vmax
        )

    def create(self, time_coord="time"):
        """
        Create animated-tiles.
        """
        print("Creating tiles ...")
        if self.engine == "rasterio":
            self.engine_instance.generate_tiles()
        elif self.engine == "xarray":
            self.engine_instance.generate_tiles(time_coord)
        print("Creating APNGs")
        create_apngs(self.engine_instance.output_folder)


# Define a base class for tile engines
class TileEngine:
    """ "
    Represents a base class for tile engines.
    """

    TILE_SIZE = 256

    def __init__(
        self,
        data: Path | xr.DataArray,
        output_folder: Path,
        min_z: int = 0,
        max_z: int = 12,
        color_map: ColorMapType | None = None,
        vmin: float = 0,
        vmax: float = 30000,
    ):
        """
        Initialize the BaseTiler class.

        Attributes:
        data (str or xarray.DataArray): The data to be animated.
        output_folder (str): The name of the local folder where the animated tiles will be exported.
        min_zz (int, optional): The min_zmum zoom level. Defaults to 0.
        max_z (int, optional): The maximum zoom level. Defaults to 12.
        color_map (dict or sequence, optional): RGBA Color Table dictionary or sequence.
        vmin (float): The minimum value for rescaling the data.
        vmax (float): The maximum value for rescaling the data.
        """
        self.data = data
        self.output_folder = output_folder
        self.min_z = min_z
        self.max_z = max_z
        self.zooms = list(np.arange(min_z, max_z + 1))
        self.color_map = color_map
        self.vmin = vmin
        self.vmax = vmax

    def generate_tiles(self, time_coord=None):
        """
        Generate tiles from the data.
        """
        raise NotImplementedError("This method should be implemented by subclasses.")


# Define a class for the rasterio engine
class RasterioEngine(TileEngine):
    """
    Represents a rasterio tiler.
    """

    def __init__(self, *args, **kwargs):
        """
        Initialize the RasterioEngine class.
        """
        super().__init__(*args, **kwargs)
        if not (isinstance(self.data, str) and os.path.isdir(self.data)):
            raise ValueError(
                "For engine 'rasterio', 'data' must be a valid directory or file path."
            )

    def _create_tile(
        self,
        tile: mercantile.Tile = None,
        tif_file_path: str = None,
        n: int = 0,
        num_bands: int = 4,
        indexes: tuple[int] | None = (1, 2, 3, 4),
        colormap: ColorMapType | None = None,
    ):
        """
        Generate a PNG tile from a GeoTIFF file using rio-tiler.

        Args:
            tile (mercantile.Tile): A mercantile tile object.
            tif_file_path (str): The file path to the GeoTIFF file.
            n (int): The index of the GeoTIFF file in the list of files.
            num_bands (int): The number of bands in the GeoTIFF file.
            indexes (int or sequence of int, optional): Band indexes.
            colormap (dict or sequence, optional): RGBA Color Table dictionary or sequence.
            vmin (float): The minimum value for rescaling the data.
            vmax (float): The maximum value for rescaling the data.
        """
        try:
            with Reader(tif_file_path) as dst:
                # Get the tile data and mask
                img = dst.tile(tile.x, tile.y, tile.z, indexes=indexes, tilesize=self.TILE_SIZE)
                # Convert the data to an image
                if num_bands == 1:
                    # Rescale the data linearly from 0-10000 to 0-255
                    img.rescale(in_range=((self.vmin, self.vmax),), out_range=((0, 255),))
                    # Apply colormap and create a PNG buffer
                    buff = img.render(colormap=colormap, add_mask=True)
                    # Open the image from the buffer
                    image = Image.open(io.BytesIO(buff))
                else:
                    image = Image.fromarray(np.uint8(np.transpose(img.data, (1, 2, 0))))

                # Save the image as a PNG
                number = "{:03d}".format(n)
                tile_dir = os.path.join(self.output_folder, str(tile.z), str(tile.x))
                tile_file = os.path.join(tile_dir, f"{tile.y}_{number}.png")
                os.makedirs(tile_dir, exist_ok=True)
                image.save(tile_file, "PNG")
        except TileOutsideBounds:
            pass
        except Exception as e:
            print(f"An error occurred while generating tiles: {e}")

    def _create_tile_wrapper(self, tile):
        self._create_tile(
            tile,
            tif_file_path=self.tif_file_path,
            n=self.n,
            num_bands=self.num_bands,
            indexes=self.indexes,
            colormap=self.color_map,
        )

    def generate_tiles(self):
        """
        Generate tiles from a GeoTIFF files.
        """
        # Get a list of all files in the directory sorted by year
        sorted_files = get_files_with_years(self.data)

        for self.n, sorted_file in tqdm(enumerate(sorted_files)):
            # Get the GeoTIFF file
            tif_file = sorted_file[0]
            self.tif_file_path = os.path.join(self.data, tif_file)

            if self.n == 0:
                # Open the GeoTIFF file
                with rasterio.open(self.tif_file_path) as src:
                    # Get the bounding box
                    bbox = list(src.bounds)
                    # Get the count of bands
                    self.num_bands = src.count

                # Calculate the tiles within the bounding box at the given zoom level
                tiles = list(mercantile.tiles(bbox[0], bbox[1], bbox[2], bbox[3], zooms=self.zooms))

                # Set the indexes parameter based on the number of bands
                self.indexes = (1, 2, 3, 4) if self.num_bands == 4 else None

            # Using ThreadPoolExecutor to parallelize the process
            with ThreadPoolExecutor() as executor:
                executor.map(self._create_tile_wrapper, tiles)


# Define a class for the xarray engine
class XArrayEngine(TileEngine):
    """
    Represents an xarray tiler.
    """

    def __init__(self, *args, **kwargs):
        """
        Initialize the XarrayEngine class.
        """
        super().__init__(*args, **kwargs)
        if not isinstance(self.data, xr.DataArray):
            raise ValueError("For engine 'xarray', 'data' must be an xarray.DataArray.")

    def _create_tile(
        self,
        tile: mercantile.Tile = None,
        da: xr.DataArray = None,
        n: int = 0,
        colormap: ColorMapType | None = None,
    ):
        """
        Generate a PNG tile from a xarray DataArray using rio-tiler.

        Args:
            tile (mercantile.Tile): A mercantile tile object.
            n (int): The index of the GeoTIFF file in the list of files.
            num_bands (int): The number of bands in the GeoTIFF file.
            indexes (int or sequence of int, optional): Band indexes.
            colormap (dict or sequence, optional): RGBA Color Table dictionary or sequence.
            vmin (float): The minimum value for rescaling the data.
            vmax (float): The maximum value for rescaling the data.
        """
        try:
            with XarrayReader(da) as dst:
                # Get the tile data and mask
                img = dst.tile(tile.x, tile.y, tile.z, tilesize=self.TILE_SIZE)
                # Convert the data to an image
                # Rescale the data linearly from 0-10000 to 0-255
                img.rescale(in_range=((self.vmin, self.vmax),), out_range=((0, 255),))
                # Apply colormap and create a PNG buffer
                buff = img.render(colormap=colormap, add_mask=True)
                # Open the image from the buffer
                image = Image.open(io.BytesIO(buff))

                # Save the image as a PNG
                number = "{:03d}".format(n)
                tile_dir = os.path.join(self.output_folder, str(tile.z), str(tile.x))
                tile_file = os.path.join(tile_dir, f"{tile.y}_{number}.png")
                os.makedirs(tile_dir, exist_ok=True)
                image.save(tile_file, "PNG")
        except TileOutsideBounds:
            pass
        except Exception as e:
            print(f"An error occurred while generating tiles: {e}")

    def _create_tile_wrapper(self, tile):
        self._create_tile(
            tile,
            da=self.da,
            n=self.n,
            colormap=self.color_map,
        )

    def generate_tiles(self, time_coord="time"):
        """
        Generate tiles from a xarray array.
        """
        # Get the time coordinates
        time_coords = self.data[time_coord].values
        # Get the bounding box
        bbox = list(self.data.rio.bounds())

        # Calculate the tiles within the bounding box at the given zoom level
        tiles = list(mercantile.tiles(bbox[0], bbox[1], bbox[2], bbox[3], zooms=self.zooms))

        for self.n in tqdm(range(len(time_coords))):
            # Get the xarray DataArray
            self.da = self.data.isel({time_coord: self.n})
            for tile in tiles:
                self._create_tile(
                    tile,
                    da=self.da,
                    n=self.n,
                    colormap=self.color_map,
                )
            # Using ThreadPoolExecutor to parallelize the process
            with ThreadPoolExecutor() as executor:
                executor.map(self._create_tile_wrapper, tiles)
