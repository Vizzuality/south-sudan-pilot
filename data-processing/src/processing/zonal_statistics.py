"""
This module contains the ZonalStatistics class.
"""

import logging
import warnings

import dask
import geopandas as gpd
import pandas as pd
import rasterio as rio
import regionmask
import xarray as xr
from dask.diagnostics import ProgressBar

# Suppress specific warnings from rasterio
warnings.filterwarnings("ignore", category=rio.errors.NotGeoreferencedWarning)
# Set the logging level for botocore to WARNING to suppress INFO messages
logging.getLogger("botocore").setLevel(logging.WARNING)


class ZonalStatisticsParallel:
    """
    Calculate zonal statistics in parallel.
    parameters
    ----------
    raster_data : xr.Dataset
        The raster data.
    vector_data : gpd.GeoDataFrame
        The vector data.
    """

    def __init__(
        self,
        raster_data: xr.Dataset,
        vector_data: gpd.GeoDataFrame,
        time_coord: str = "time",
        unit: str = None,
        year: int = None,
    ) -> pd.DataFrame:
        """
        Initialize the ZonalStatistics object.
        """
        self.raster_data = raster_data
        self.vector_data = vector_data
        self.groups = self.vector_data.groupby("index")
        self.time_coord = time_coord
        self.unit = unit
        self.year = year
        self.variable = list(self.raster_data.data_vars)[0]

    def _get_sliced_data(self, group: gpd.GeoDataFrame) -> xr.Dataset:
        """Slice the raster dataset based on the bounds of a vector group."""
        x_slice = slice(group.total_bounds[0], group.total_bounds[2])
        y_slice = slice(group.total_bounds[3], group.total_bounds[1])

        ds_sliced = self.raster_data.sel(x=x_slice, y=y_slice).copy()
        return ds_sliced

    def _rasterize_vector_data(self, ds: xr.Dataset, polygon: gpd.GeoDataFrame) -> xr.DataArray:
        """
        Rasterize vector data.
        """
        return regionmask.mask_geopandas(polygon, ds.x, ds.y, numbers="index")

    def _worker_compute_mean_value(self, ds_sliced: xr.Dataset, group: gpd.GeoDataFrame):
        """
        Function to calculate the mean value on the sliced data.
        """
        index = group.index[0]

        try:
            mask = self._rasterize_vector_data(ds_sliced, group)
            ds_sliced["mask"] = mask

            mean_value = ds_sliced[self.variable].where(ds_sliced["mask"] == index).mean(["x", "y"])

            return index, mean_value.values
        except ValueError:
            mean_value = ds_sliced[self.variable].mean(["x", "y"])
            return index, mean_value.values

    def compute(self):
        """
        Compute zonal statistics in parallel using Dask delayed execution for each vector group.
        """
        tasks = [
            dask.delayed(self._worker_compute_mean_value)(self._get_sliced_data(group), group)
            for _, group in self.groups
        ]

        with ProgressBar(minimum=0.01):
            mean_values = dask.compute(*tasks)

        # Create a DataFrame from the results
        df = pd.DataFrame(mean_values, columns=["index", "x_axis_values"])

        # Add y_axis_values to mean_values
        df["y_axis_values"] = str((self.raster_data[self.time_coord].values.tolist()))

        # Add units
        df["x_axis_unit"] = self.time_coord
        df["y_axis_unit"] = self.unit

        # Add year
        if self.year:
            df["year"] = self.year

        # Merge gdf and mean_values on 'index'
        df = pd.merge(self.vector_data.drop(columns="geometry"), df, on="index")

        df = df.drop(columns="index")

        return df


class ZonalStatistics:
    """
    Calculate zonal statistics.
    parameters
    ----------
    raster_data : xr.Dataset
        The raster data.
    vector_data : gpd.GeoDataFrame
        The vector data.
    """

    def __init__(
        self,
        raster_data: xr.Dataset,
        vector_data: gpd.GeoDataFrame,
        time_coord: str = "time",
        unit: str = None,
        year: int = None,
    ) -> pd.DataFrame:
        """
        Initialize the ZonalStatistics object.
        """
        self.raster_data = raster_data
        self.vector_data = vector_data
        self.time_coord = time_coord
        self.unit = unit
        self.year = year
        self.variable = list(self.raster_data.data_vars)[0]

    def _rasterize_vector_data(self):
        # Rasterize vector data
        mask = regionmask.mask_geopandas(
            self.vector_data, self.raster_data.x, self.raster_data.y, numbers="index"
        )
        # Add mask to raster data
        self.raster_data["mask"] = mask

    def _compute_mean_value(self, group):
        """
        Compute the mean value for each group.
        """
        bbox = group.total_bounds
        ds_tmp = self.raster_data.sel(x=slice(bbox[0], bbox[2]), y=slice(bbox[3], bbox[1]))
        mean_value = ds_tmp[self.variable].where(ds_tmp["mask"] == group.name).mean(["x", "y"])
        return mean_value.values

    def compute(self):
        """
        Compute zonal statistics.
        """
        # Rasterize vector data
        self._rasterize_vector_data()
        # Compute the mean value for each geometry
        mean_values = self.vector_data.groupby("index").apply(self._compute_mean_value)

        # Reset the index of mean_values
        mean_values = mean_values.reset_index()

        # Rename the columns of mean_values
        mean_values.columns = ["index", "x_axis_values"]

        # Add y_axis_values to mean_values
        mean_values["y_axis_values"] = str((self.raster_data[self.time_coord].values.tolist()))

        # Add units
        mean_values["x_axis_unit"] = self.time_coord
        mean_values["y_axis_unit"] = self.unit

        # Add year
        if self.year:
            mean_values["year"] = self.year

        # Merge gdf and mean_values on 'index'
        df = pd.merge(self.vector_data.drop(columns="geometry"), mean_values, on="index")

        df = df.drop(columns="index")

        return df
