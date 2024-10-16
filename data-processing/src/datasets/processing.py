"""
This module contains the function to process datasets and create layers.
"""

import json
from typing import List

from tqdm import tqdm


class LayerProcessing:
    """
    Class to process datasets and create layers.
    """

    def __init__(self, datasets: dict, datasets_list: List, dict_path: str):
        """
        Initialize the DatasetProcessor class.

        Args:
            datasets (dict): Dictionary containing all the dataset objects.
            datasets_list (List): The list of dataset names to process.
            dict_path (str): The path to the json file to store
                which layers have been processed.
        """
        self.datasets = datasets
        self.datasets_list = datasets_list
        self.dict_path = dict_path
        self.datasets_dict = self._load_datasets_dict()

    def _load_datasets_dict(self):
        with open(self.dict_path, "r") as file:
            return json.load(file)

    def _save_datasets_dict(self, dataset_name, layer_name, file_name):
        """
        Update the datasets dictionary and save it to a file.
        """
        # Check if dataset_name is already in the dictionary, if not add it
        if dataset_name not in self.datasets_dict:
            self.datasets_dict[dataset_name] = {}

        # Update the layer information
        self.datasets_dict[dataset_name][layer_name] = file_name

        # Save the updated dictionary to the file
        with open(self.dict_path, "w") as f:
            json.dump(self.datasets_dict, f)

    def _generate_file_name(self, dataset_name, layer_name):
        """
        Generate a file name based on the dataset name and layer name.
        """
        # Generate shortened dataset name
        shortened_dataset_name = "".join(word[0] for word in dataset_name.split()).upper()

        # Process layer name to create a file-friendly version
        layer_name_lower = layer_name.lower().replace(" - ", " ").replace(" ", "_")

        # Form the file name
        file_name = f"{shortened_dataset_name}_{layer_name_lower}"
        return file_name

    def create_layers(self):
        """
        Process the datasets and create layers.
        """
        for dataset_name in tqdm(self.datasets_list):
            print(dataset_name)

            dataset = self.datasets.get(dataset_name)
            layers = dataset.layers()
            for layer_name, layer in tqdm(layers.items()):
                if layer_name not in self.datasets_dict.get(dataset_name, {}):
                    print("Processing", layer_name, "from", dataset_name)
                    # Generate file name
                    file_name = self._generate_file_name(dataset_name, layer_name)
                    # Process the layer and save it
                    layer.process_data(file_name)
                    # Update and save the datasets dictionary
                    self._save_datasets_dict(dataset_name, layer_name, file_name)
