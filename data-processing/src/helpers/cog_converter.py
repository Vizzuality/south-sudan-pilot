"""
A module to convert GeoTIFF files to Cloud-Optimized GeoTIFF (COG) format.
"""

import subprocess
from pathlib import Path


class COGConverter:
    """
    A class to convert GeoTIFF files to Cloud-Optimized GeoTIFF (COG) format.
    """

    @staticmethod
    def convert(geotiff_path: Path, cog_output_path: Path):
        """
        Convert a GeoTIFF file to COG format using rio-cogeo.

        Args:
            geotiff_path (Path): The path to the GeoTIFF file.
            cog_output_path (Path): The path where the COG file will be saved.
        """
        command = [
            "rio",
            "cogeo",
            "create",
            str(geotiff_path),
            str(cog_output_path),
        ]
        try:
            subprocess.run(command, check=True)
        except subprocess.CalledProcessError as e:
            print(f"Error converting GeoTIFF to COG: {e}")
