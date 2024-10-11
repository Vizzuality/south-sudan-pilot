"""
This module provides a class to represent a dataset and a database of datasets.
"""

import json

from factory.layers import get_layer
from representations import AsDictionaryMixin

from .pre_processing import get_pre_processing


class _DatasetDatabase:
    CONFIG_PATH = "../src/datasets/datasets_config.json"

    def __init__(self):
        self._datasets = self.load_config(self.CONFIG_PATH)

    def load_config(self, path):
        """
        Loads the dataset configuration from a JSON file.

        Parameters:
        path: Path to the JSON configuration file.
        Returns:
        Loaded configuration dictionary.
        """
        try:
            with open(path, "r") as file:
                return json.load(file)
        except FileNotFoundError:
            print(f"Configuration file {path} not found.")
            return {}
        except json.JSONDecodeError:
            print(f"Error decoding JSON from {path}.")
            return {}

    def datasets(self):
        """
        Returns a list of available datasets.
        """
        return {name_: Dataset(name_) for name_ in sorted(self._datasets)}

    def get_dataset_info(self, dataset_name):
        """
        Returns the information for a dataset.
        """
        info = self._datasets.get(dataset_name)
        if not info:
            raise ValueError(f"Dataset with ID {dataset_name} not found.")
        return info

    def get_layer_info(self, dataset_name, layer_name):
        """
        Returns the information for a layer.
        """
        dataset_info = self.get_dataset_info(dataset_name)
        layer_info = dataset_info.get(layer_name)
        if not layer_info:
            raise ValueError(f"Layer with ID {layer_name} not found.")
        return layer_info


class Dataset(AsDictionaryMixin):
    """
    Represents a dataset.
    """

    def __init__(self, dataset_name):
        """
        Initializes the dataset.
        """
        self.name = dataset_name
        self._layers = dataset_database.get_dataset_info(self.name)

    def layers(self):
        """
        Returns a list of available layers.
        """
        return {name_: Layer(self.name, name_) for name_ in sorted(self._layers)}


class Layer(AsDictionaryMixin):
    """
    Represents a layer.
    """

    def __init__(self, dataset_name, layer_name):
        """
        Initializes the layer.
        """
        self.name = layer_name
        info = dataset_database.get_layer_info(dataset_name, self.name)
        self.type = info.get("type")
        self.format = info.get("format")
        self.url = info.get("base_url")
        self.styles = info.get("styles")
        self._layer = get_layer(self.type, self.format)
        self._pre_processing = get_pre_processing(dataset_name, self.name)

    def load_data(self):
        """
        Loads the data from the base URL.
        """
        data = self._layer.load_data(self.url)
        return data

    def pre_process_data(self, data):
        """
        Processes the data if a processing function is defined.
        Otherwise, returns the data as is.
        """
        if self._pre_processing is None:
            return data  # Return data without processing if no processing is defined
        else:
            return self._pre_processing.process(data)  # Process the data as before

    def get_data(self):
        """
        Returns the processed data.
        """
        data = self.load_data()
        return self.pre_process_data(data)

    def process_data(self, file_name):
        """
        Process the data and save it to the output path.
        """
        if self.type == "raster" and self.format == "GeoTIFF":
            self._layer.process(self.url, self.styles, file_name)
        else:
            data = self.get_data()
            self._layer.process(data, file_name)


dataset_database = _DatasetDatabase()
