"""
This module contains the _ProcessingSystem class, which is responsible for processing
datasets based on the dataset ID.
"""

import geopandas as gpd
import xarray as xr


class _ProcessingSystem:
    def __init__(self):
        self._dataset_processing = {
            "Boundaries": {
                "Administrative Boundaries - adm0": VectorProcessing(
                    columns=["ADM0_EN", "ADM0_PCODE", "geometry"], level=0
                ),
                "Administrative Boundaries - adm1": VectorProcessing(
                    columns=["ADM0_EN", "ADM0_PCODE", "ADM1_EN", "ADM1_PCODE", "geometry"], level=1
                ),
                "Administrative Boundaries - adm2": VectorProcessing(
                    columns=[
                        "ADM0_EN",
                        "ADM0_PCODE",
                        "ADM1_EN",
                        "ADM1_PCODE",
                        "ADM2_EN",
                        "ADM2_PCODE",
                        "geometry",
                    ],
                    level=2,
                ),
                "Administrative Boundaries - adm3": VectorProcessing(
                    columns=[
                        "ADM0_EN",
                        "ADM0_PCODE",
                        "ADM1_EN",
                        "ADM1_PCODE",
                        "ADM2_EN",
                        "ADM2_PCODE",
                        "ADM3_EN",
                        "ADM3_PCODE",
                        "geometry",
                    ],
                    level=3,
                ),
                "Hydrological Basins": VectorProcessing(
                    columns=["OBJECTID", "BasinName", "geometry"]
                ),
            },
            "Hydrometeorological Data": {
                "Precipitation": RasterProcessing(
                    variable="precipitation_amount",
                    temporal_coverage=slice("2022-01-01", "2022-12-31"),
                    temporal_resolution="time.month",
                    groupby_type="sum",
                ),
                "Temperature": RasterProcessing(
                    variable="t2m",
                    temporal_coverage=slice("2022-01-01", "2022-12-31"),
                    temporal_resolution="time.month",
                    groupby_type="mean",
                ),
                "Soil moisture": RasterProcessing(
                    variable="mean_swvl1_swvl2",
                    temporal_coverage=slice("2023-01-01", "2023-12-31"),
                    temporal_resolution="time.month",
                    groupby_type="mean",
                ),
            },
            "Hydrographic data": {
                "Rivers": VectorProcessing(
                    columns=["FID_HydroR", "HYRIV_ID", "MAIN_RIV", "geometry"]
                ),
            },
            "Populated infrastructures": {
                "Education facilities": VectorProcessing(
                    columns=["name", "amenity", "osm_id", "geometry"]
                ),
                "Health facilities": VectorProcessing(
                    columns=["name", "amenity", "osm_id", "geometry"]
                ),
            },
            "Transportation Network Infrastructures": {
                "Roads": VectorProcessing(columns=["highway", "osm_id", "geometry"]),
            },
            "Water-related infrastructures": {
                "Waterways": VectorProcessing(columns=["waterway", "osm_id", "geometry"]),
            },
        }

    def get_processing(self, dataset_name, layer_name):
        """
        Returns the processing object for the given dataset ID.
        """
        processing = self._dataset_processing.get(dataset_name).get(layer_name)
        return processing


class VectorProcessing:
    """
    Represents the processing of a vector dataset.
    """

    def __init__(self, columns, level=None):
        """
        Initializes the processing.
        """
        self.columns = columns
        self.level = level

    def process(self, gdf: gpd.GeoDataFrame) -> gpd.GeoDataFrame:
        """
        Processes the GeoDataFrame.
        """
        if self.level is not None:
            gdf["level"] = self.level
            gdf = gdf[["level"] + self.columns]
        else:
            gdf = gdf[self.columns]

        gdf.columns = [column.lower() for column in gdf.columns]
        # Reorder columns
        columns_except_geometry = [col for col in gdf.columns if col != "geometry"]
        columns_new_order = columns_except_geometry + ["geometry"]
        gdf = gdf[columns_new_order]

        return gdf.reset_index()


class RasterProcessing:
    """
    Represents the processing of a raster dataset.
    """

    def __init__(
        self, variable, temporal_coverage=None, temporal_resolution=None, groupby_type=None
    ):
        """
        Initializes the processing.
        """
        self.variable = variable
        self.temporal_coverage = temporal_coverage
        self.temporal_resolution = temporal_resolution
        self.groupby_type = groupby_type

    def process(self, ds: xr.Dataset) -> xr.Dataset:
        """
        Processes the xarray dataset.
        """
        # Choose the variable of interest
        da = ds[self.variable]
        attrs = ds.attrs
        # Select the temporal coverage
        if self.temporal_coverage:
            da = da.sel(time=self.temporal_coverage)
            # Group by temporal resolution
            if self.groupby_type == "mean":
                da = da.groupby(self.temporal_resolution).mean()
            elif self.groupby_type == "sum":
                da = da.groupby(self.temporal_resolution).sum()

        ds = xr.Dataset({self.variable: da})
        ds.attrs = attrs

        return ds


_processing_system = _ProcessingSystem()


def get_processing(dataset_name, layer_name):
    """
    Returns the processing object for the given dataset ID.
    """
    try:
        return _processing_system.get_processing(dataset_name, layer_name)
    except AttributeError:
        return None
