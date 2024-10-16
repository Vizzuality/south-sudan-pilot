"""
This module contains the get_vector_layer method, which is responsible for creating
vector layer objects based on the type of vector layer requested.
"""

from pathlib import Path

import geopandas as gpd
from helpers.tippecanoe import mbtile_generation


# Factory for creating raster layers
class _VectorLayerFactory:
    def __init__(self):
        self._vector_layer_types = {"Shapefile": ShapefileVectorLayer}

    def get_vector_type(self, format_type):
        vector_layer = self._vector_layer_types.get(format_type)
        if not format_type:
            raise ValueError(f"Type {format_type} not found.")
        return vector_layer()


# Shapefile vector layer implementation
class ShapefileVectorLayer:
    """
    Represents a vector layer.
    """

    VECTOR_PATH = Path("../data/processed/VectorLayers")

    def load_data(self, url):
        """
        Loads the data from the base URL.
        """
        print(f"Loading data from {url}...")
        df = gpd.read_file(url)
        return df

    def process(self, data, file_name):
        """
        Process the vector data.
        """
        # Generate MBTile
        output_path = ShapefileVectorLayer.VECTOR_PATH / Path(file_name).with_suffix(".mbtiles")
        mbtile_generation(data, output_path)


vector_layer_factory = _VectorLayerFactory()


def get_vector_layer(format_type):
    """
    Returns a vector layer of the given format.
    """
    return vector_layer_factory.get_vector_type(format_type)
