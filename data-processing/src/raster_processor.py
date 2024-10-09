"""
This module contains the StyledRasterProcessor class which is used to style raster data using a QML
file and convert it to MBTiles format.
"""

import logging
import os
from pathlib import Path

import numpy as np
import rasterio
import xarray as xr
from helpers.cog_converter import COGConverter
from helpers.mbtiles_converter import MBTilesConverter
from helpers.qml_parser import QMLParser
from qgis.core import (
    QgsRasterFileWriter,
    QgsRasterLayer,
    QgsRasterPipe,
)

logging.basicConfig(level=logging.INFO)


class QgsStyledRasterProcessor:
    """
    A class to style raster data using a QML file and convert it to MBTiles format.
    """

    def __init__(self, url: str, qml_file: Path, output_file_base_path: Path):
        """
        Initialize the StyledRasterProcessor object.

        Args:
            url (str): The URL of the raster data.
            qml_file (Path): The path to the QML file.
            output_file_base_path (Path): The base path where the output files will be saved.
        """
        self.url = url
        self.qml_file = qml_file
        self.output_file_base_path = output_file_base_path
        self.logger = logging.getLogger(__name__)

    def apply_styles(self) -> QgsRasterLayer:
        """
        Apply styles from the QML file to the raster data.
        """
        try:
            # Load the raster layer
            raster_layer = QgsRasterLayer(self.url, "layer.name")

            # Check if the layer is valid
            if not raster_layer.isValid():
                print("Layer failed to load!")
            else:
                # Apply style from QML file
                raster_layer.loadNamedStyle(str(self.qml_file))

        except Exception as e:
            print(f"An error occurred: {e}")

        return raster_layer

    def convert_to_geotiff(self, raster_layer: QgsRasterLayer) -> Path:
        """
        Convert the styled raster data to a GeoTIFF file.
        """
        try:
            # Save the styled layer as GeoTIFF
            output_path = self.output_file_base_path.with_suffix(".tif")
            file_writer = QgsRasterFileWriter(str(output_path))

            # Retrieve layer's renderer and provider
            renderer = raster_layer.renderer()
            provider = raster_layer.dataProvider()

            # Define parameters for writing the file
            pipe = QgsRasterPipe()
            pipe.set(provider.clone())
            pipe.set(renderer.clone())

            # Write the raster layer to a GeoTIFF file
            error = file_writer.writeRaster(
                pipe, provider.xSize(), provider.ySize(), provider.extent(), provider.crs()
            )

            if error != QgsRasterFileWriter.NoError:
                print("Error writing GeoTIFF:", file_writer.error())

        except Exception as e:
            print(f"An error occurred: {e}")

        return output_path

    def process(self):
        """
        Process the raster data: apply styles, convert to GeoTIFF, and then to MBTiles.

        Args:
            layer_name (str): The name of the layer to be processed.
        """
        try:
            self.logger.info("Applying styles")
            raster_layer = self.apply_styles()

            self.logger.info("Converting to GeoTIFF")
            geotiff_path = self.convert_to_geotiff(raster_layer)

            self.logger.info("Converting to Cloud-Optimized GeoTIFF")
            COGConverter.convert(geotiff_path, geotiff_path)
            self.logger.info(f"Processing complete. Output saved to {geotiff_path}")
        except Exception as e:
            self.logger.error(f"Error processing raster: {e}")
            raise


class StyledRasterProcessor:
    """
    A class to style raster data using a QML file and convert it to MBTiles format.
    """

    def __init__(self, ds: xr.Dataset, qml_file: Path, output_file_base_path: Path):
        """
        Initialize the StyledRasterProcessor object.

        Args:
            ds (xr.Dataset): An xarray Dataset containing the raster data.
            qml_file (Path): The path to the QML file.
            output_file_base_path (Path): The base path where the output files will be saved.
        """
        self.ds = ds
        self.qml_file = qml_file
        self.output_file_base_path = output_file_base_path
        self.color_map = {}
        self.logger = logging.getLogger(__name__)

    def apply_styles(self) -> np.ndarray:
        """
        Apply styles from the QML file to the raster data.

        Returns:
            np.ndarray: The styled raster data as a NumPy array.
        """
        self.color_map = QMLParser.parse(self.qml_file)
        raster_data = self.ds["band_data"].values[0, :, :]
        styled_raster = np.zeros((raster_data.shape[0], raster_data.shape[1], 4), dtype=np.uint8)
        for value, color in self.color_map.items():
            indices = np.where(raster_data == value)
            styled_raster[indices] = np.array(
                [int(color[i : i + 2], 16) for i in (1, 3, 5)] + [255]
            )
        return styled_raster

    def convert_to_geotiff(self, styled_raster: np.ndarray) -> Path:
        """
        Convert the styled raster data to a GeoTIFF file.

        Args:
            styled_raster (np.ndarray): The styled raster data.

        Returns:
            Path: The path to the generated GeoTIFF file.
        """
        output_path = self.output_file_base_path.with_suffix(".tif")
        styled_raster_transposed = np.transpose(styled_raster, (2, 0, 1))
        with rasterio.open(
            output_path,
            "w",
            driver="GTiff",
            height=styled_raster.shape[0],
            width=styled_raster.shape[1],
            count=4,  # 4 bands: R, G, B, A
            dtype=styled_raster.dtype,
            crs=self.ds.rio.crs,
            transform=self.ds.rio.transform(),
        ) as dst:
            dst.write(styled_raster_transposed)
        return output_path

    def process(self):
        """
        Process the raster data: apply styles, convert to GeoTIFF, and then to MBTiles.

        Args:
            layer_name (str): The name of the layer to be processed.
        """
        try:
            styled_raster = self.apply_styles()
            geotiff_path = self.convert_to_geotiff(styled_raster)
            mbtiles_path = self.output_file_base_path.with_suffix(".mbtiles")
            MBTilesConverter.convert(geotiff_path, mbtiles_path)
            self.logger.info(f"Processing complete. Output saved to {mbtiles_path}")
            # Remove the GeoTIFF file after conversion
            os.remove(geotiff_path)
        except Exception as e:
            self.logger.error(f"Error processing raster: {e}")
            raise
