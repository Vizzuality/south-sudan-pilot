"""
A module to convert GeoTIFF files to MBTiles format.
"""

import subprocess
from pathlib import Path


# TODO:[Convert Raster GeoTIFF to MBTiles](https://github.com/UrbanSystemsLab/raster-to-mbtiles/blob/master/README.md)
# using the following command:
# gdal2mbtiles --verbose --min-resolution 4 --max-resolution 12 Population.tif geoTiff_raw.mbtiles
class MBTilesConverter:
    """
    A class to convert GeoTIFF files to MBTiles format.
    """

    @staticmethod
    def convert(geotiff_path: Path, mbtiles_path: Path, min_zoom: int = 4, max_zoom: int = 12):
        """
        Convert a GeoTIFF file to MBTiles format using gdal_translate.

        Args:
            geotiff_path (Path): The path to the GeoTIFF file.
            mbtiles_path (Path): The path where the MBTiles file will be saved.
        """
        command = [
            "rio",
            "mbtiles",
            str(geotiff_path),
            str(mbtiles_path),
            "--format",
            "PNG",
            "--zoom-levels",
            f"{min_zoom}..{max_zoom}",
            "--rgba",
            "--overwrite",
        ]
        try:
            subprocess.run(command, check=True, stdout=subprocess.PIPE, stderr=subprocess.PIPE)
        except subprocess.CalledProcessError as e:
            print(f"Error converting GeoTIFF to MBTiles: {e}")
