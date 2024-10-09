"""
A module to parse QML files.
"""

import xml.etree.ElementTree as ET  # noqa: N817
from typing import Dict


class QMLParser:
    """
    A class to parse QML files.
    """

    @staticmethod
    def parse(qml_file_path: str) -> Dict[int, str]:
        """
        Parse the QML file to extract color mappings.

        Args:
            qml_file_path (str): The path to the QML file.

        Returns:
            Dict[int, str]: A dictionary mapping raster values to color codes.
        """
        color_map = {}
        tree = ET.parse(qml_file_path)
        root = tree.getroot()
        for entry in root.findall(".//paletteEntry"):
            value = int(entry.get("value"))
            color = entry.get("color")
            color_map[value] = color
        return color_map
