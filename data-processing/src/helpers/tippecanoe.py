"""
Module for tippecanoe functions.
"""

import logging
import subprocess
from pathlib import Path
from typing import Union

import pandas as pd


def dataframe_to_geojson(df: pd.DataFrame, output_path: Path) -> Path:
    """
    Convert DataFrame to GeoJSON file.

    Args:
        df (pd.DataFrame): The DataFrame to convert.
        output_path (Path): The path to the output file.
    """
    df.to_file(output_path, driver="GeoJSON")
    return output_path


def json_to_mbtiles(source_path: Path, output_path: Union[Path, None] = None) -> Path:
    """
    Convert GeoJSON file to mbtiles file.

    Args:
        source_path (Path): The path to the source file.
        output_path (Union[Path, None], optional): The path to the output file. The default is None.

    Returns:
        output_path (Path): The path to the output file.
    """
    if not output_path:
        output_path = source_path.with_suffix(".json")

    subprocess.run(
        f"tippecanoe -zg -f -P -o {output_path} --coalesce-densest-as-needed"
        "--extend-zooms-if-still-dropping {source_path}",
        shell=True,
        check=True,
    )
    source_path.unlink()
    return output_path


def mbtile_generation(data: pd.DataFrame, output_path: Path) -> Path:
    """
    Generate mbtiles file from DataFrame.

    Args:
        data (pd.DataFrame): The DataFrame to convert.
        output_path (Path): The path to the output file.

    Returns:
        Path: The path to the output file.

    """
    try:
        logging.info("Creating JSON file...")
        data_path = dataframe_to_geojson(data, output_path.with_suffix(".json"))

        logging.info("Creating mbtiles file...")
        json_to_mbtiles(data_path, output_path.with_suffix(".mbtiles"))

    except Exception as e:
        raise e
