"""
This module contains the get_layer method, which is responsible for creating
layer objects based on the type of layer requested.
"""

from rasters import get_raster_layer
from vectors import get_vector_layer


# Factory for creating layers
class _LayerFactory:
    def __init__(self):
        self._types = {
            "raster": get_raster_layer,
            "vector": get_vector_layer,
        }

    def get_type(self, type_name, format_type):
        """
        Returns a layer of the given type.
        """
        layer_type = self._types.get(type_name)
        if not layer_type:
            raise ValueError(f"Type {type_name} not found.")
        return layer_type(format_type)


layer_factory = _LayerFactory()


def get_layer(type_name, format_type):
    """
    Returns a layer of the given type.
    """
    return layer_factory.get_type(type_name, format_type)
