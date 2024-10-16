"""
This module contains utility functions for creating animations.
"""

import os
import re
from pathlib import Path
from typing import Dict, List, Tuple

import matplotlib
import numpy as np
from apng import APNG


def create_apngs(tile_dir: Path):
    """
    Create APNGs from the tiles.

    Attributes:
        tile_dir (str): The name of the local folder where the animated tiles will be exported.
    """
    for z_dir in os.listdir(tile_dir):
        for x_dir in os.listdir(os.path.join(tile_dir, z_dir)):
            file_names = os.listdir(os.path.join(tile_dir, z_dir, x_dir))

            tiles = [x.split("_")[0] for x in file_names]
            tiles = list(set(tiles))
            for tile in tiles:
                png_files = list(filter(lambda x: x.split("_")[0] == tile, file_names))
                png_files = sorted(png_files, key=lambda x: float(x.split(".")[0]))
                png_files = [os.path.join(tile_dir, z_dir, x_dir, i) for i in png_files]
                # Create APNG
                APNG.from_files(png_files, delay=1).save(png_files[0][:-8] + ".png")
                # Remove PNGs
                [os.remove(file) for file in png_files]


def get_files_with_years(input_folder):
    """
    Get a list of all files in the directory sorted by year.

    Returns:
    list: A list of tuples, where each tuple contains the filename and the year.
    """
    # Get a list of all files in the directory
    files = os.listdir(input_folder)
    # Create a list of tuples, where each tuple contains the filename and the year
    files_with_years = [
        (f, int(re.search(r"(\d{4})\.tif$", f).group(1)))
        for f in files
        if re.search(r"(\d{4})\.tif$", f)
    ]
    # Sort the list of tuples based on the year
    sorted_files = sorted(files_with_years, key=lambda x: x[1])
    return sorted_files


def create_linear_segmented_colormap(colors_list: List[str]) -> Dict[int, Tuple[int, int, int]]:
    """
    Create a linear segmented colormap.

    Attributes:
        colors_list (list): A list of colors.
    """
    colors = matplotlib.colors.LinearSegmentedColormap.from_list("colors", colors_list, 256)

    x = np.linspace(0, 1, 256)
    cmap_vals = colors(x)[:, :]
    cmap_uint8 = (cmap_vals * 255).astype("uint8")
    cm = {idx: tuple(value) for idx, value in enumerate(cmap_uint8)}

    return cm
