"""
This module contains a mixin class that provides a method to convert an object to a dictionary.
"""


class AsDictionaryMixin:
    """
    Mixin class that provides a method to convert an object to a dictionary.
    """

    def to_dict(self):
        """
        Returns the object as a dictionary.
        """
        return {
            prop: self._represent(value)
            for prop, value in self.__dict__.items()
            if not self._is_internal(prop)
        }

    def _represent(self, value):
        if isinstance(value, object):
            if hasattr(value, "to_dict"):
                return value.to_dict()
            else:
                return str(value)
        else:
            return value

    def _is_internal(self, prop):
        return prop.startswith("_")
