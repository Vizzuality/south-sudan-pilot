"""
This module contains the ZonalStatistics class.
"""

import geopandas as gpd
import pandas as pd
import regionmask
import xarray as xr


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
    ) -> pd.DataFrame:
        """
        Initialize the ZonalStatistics object.
        """
        self.raster_data = raster_data
        self.vector_data = vector_data
        self.time_coord = time_coord
        self.unit = unit
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

        # Merge gdf and mean_values on 'index'
        df = pd.merge(self.vector_data.drop(columns="geometry"), mean_values, on="index")

        df = df.drop(columns="index")

        return df
