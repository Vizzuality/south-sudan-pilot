South Sudan Pilot - Data processing
==============================

## Setup

### The environment

To run the notebooks and scripts you need to create an environment with the dependencies. There are two options:

#### Docker

If you have [docker](https://docs.docker.com/engine/install/) in your system,
you run a jupyter lab server with:

``` bash
docker compose up --build
```

And if you want to get into the container, use a terminal in jupyter lab,
vscode remote development or run this command:

```shell
docker exec -it data_processing_notebooks /bin/bash
```

#### Conda environment

Create the environment with:

``` bash
mamba env create -n south_sudan_pilot_gmv -f environment.yml
```

This will create an environment called south_sudan_pilot_gmv with a common set of dependencies.

To install the **pre-commit hooks**, with the environment activated and in the project root directory, run:

``` bash
pre-commit install
```

#### Update the environment

If you need to update the environment installing a new package, you simply do it with:

``` bash
mamba install [package]  # or `pip install [package]` if you want to install it via pip
```

then update the environment.yml file so others can clone your environment with:

``` bash
mamba env export --no-builds -f environment.yml
```

### Environment variables

The environment variables are stored in a `.env` file. You can copy the `.env.example` file and fill in the values:

``` bash
cp .env.example .env
```

## Notebooks

The notebooks are stored in the `notebooks` directory. To run the notebooks, you need to start the jupyter lab server:

``` bash
jupyter lab
```

You can also run the notebooks in [vscode](https://code.visualstudio.com/) with the required [extensions](https://code.visualstudio.com/docs/datascience/jupyter-notebooks).

### Notebooks Structure

The `notebooks` directory contains the following files, each serving specific purposes:

- **[01_precalculations.ipynb](notebooks/01_precalculations.ipynb)**: This notebook is used to precalculate data for different regions in South Sudan. Includes data access, setup for computational resources, and data acquisition scripts.
- **[02_animated_tiles.ipynb](notebooks/02_animated_tiles.ipynb)**: This notebook is used to create animated tiles. It explains how to create animated tiles from Xarray Datasets, using both default and custom colormaps.
- **[03_create_layers.ipynb](notebooks/03_create_layers.ipynb)**: This notebook is used to prepare the data layers for South Sudan. The data layers will be processed and upload to Mapbox or AWS S3.
- **[04_prepare_tabular_data.ipynb](notebooks/04_prepare_tabular_data.ipynb)**: This notebook is designed to prepare location and chart data for upload to Strapi.
- **[05_in-situ_layers.ipynb](notebooks/05_in-situ_layers.ipynb)**: This notebook focuses on processing in-situ data layers. It accesses data from a Google Cloud Storage bucket and processes data from different sources like the Hurst Nile Basin Volumes (HYDROC) and the Ministry of Water Resources and Irrigation (MWRI).

Each notebook provides detailed explanations to guide users through the data processing tasks. The notebooks are well-structured and include markdown cells to explain the purpose of each code block and the expected output.

## Source Code

The `src` directory contains the Python modules and configuration files that are used for data processing in the South Sudan project. The directory contains modules for **dataset management, layer creation, data processing, animation generation, and various helper utilities**. The code in `src` uses a **factory pattern** to create layer objects, which are configured through the `datasets_config.json` file.
The directory is structured into several subfolders, each with a specific purpose. Here's a breakdown of the structure and content:

- **`datasets/`**: This directory contains modules and configurations related to datasets.
    *   `datasets.py`: This module provides a class to represent a dataset and a database of datasets. It includes methods to load dataset configurations and access layers.
    *   `datasets_config.json`: This JSON file stores the configuration for all the datasets, including their types, formats, base URLs, and styles. This includes configurations for various layers such as flood hazards, drought exposures, hydrometeorological data, and contextual layers. The configurations specify whether the data is raster or vector, and provides the location of the data, whether a local file or a URL.
    *   `pre_processing.py`: Prepares raw datasets for subsequent processing.
    *   `processing.py`: Contains high-level logic for handling data transformations.
    *   `representations.py`: Helper classes for representing datasets and layers in a structured format.

- **`factory/`**: This directory contains modules for creating different types of data layers.
    *   `layers.py`: Abstracts layer creation logic based on the type of layer requested (raster or vector).
    *    `vectors.py`: Handles vector layer objects based on the specified format type, such as Shapefile.
    *   `rasters.py`: Handles raster layer objects based on different raster formats such as Zarr and GeoTIFF. It includes functions for processing raster data, creating animated tiles, and applying styles.
- **`processing/`**: This directory includes modules for data processing tasks.
    *   `zonal_statistics.py`: Performs zonal statistical analysis, combining vector and raster data.

- **`animations/`**: This directory contains modules related to creating animations.
    *   `animated_tiles.py`: This module contains the `AnimatedTiles` class, which is used to generate animated tiles from raster data. It supports various configurations for styling and output.
    *   `utils.py`: This module provides utility functions for creating animations, such as creating [APNGs](https://en.wikipedia.org/wiki/APNG) from tiles.

- **helpers/**: Provides various utility scripts for geospatial data handling.
  - `raster_tiles.py`, `raster_processor.py`: Process raster data into tiles for efficient visualization.
  - `qml_parser.py`: Parses QGIS style files.
  - `mapbox_uploader.py`, `s3_uploader.py`: Automates the upload of processed layers to cloud storage (e.g., Mapbox, AWS S3).
  - `tippecanoe.py`: Converts vector data into Mapbox vector tiles.
