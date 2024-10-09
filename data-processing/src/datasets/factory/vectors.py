"""
This module contains the get_vector_layer method, which is responsible for creating
vector layer objects based on the type of vector layer requested.
"""

import geopandas as gpd


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

    def load_data(self, url):
        """
        Loads the data from the base URL.
        """
        print(f"Loading data from {url}...")
        df = gpd.read_file(url)
        return df


vector_layer_factory = _VectorLayerFactory()


def get_vector_layer(format_type):
    """
    Returns a vector layer of the given format.
    """
    return vector_layer_factory.get_vector_type(format_type)
