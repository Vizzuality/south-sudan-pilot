"""
Module to upload data to s3 bucket.
"""

import logging
import os
from concurrent.futures import ThreadPoolExecutor, as_completed

import boto3
from botocore.config import Config
from dotenv import load_dotenv
from tqdm import tqdm

# Set logging level for botocore to WARNING
logging.getLogger("botocore").setLevel(logging.WARNING)


# Load environment variables from the .env file
load_dotenv()

# Access credentials from the environment variables
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_DEFAULT_REGION")
AWS_BUCKET_NAME = os.getenv("AWS_BUCKET_NAME")


def upload_files_to_s3_parallel(
    folder_path: str, destination_blob_path: str, max_workers: int = 50
):
    """
    Upload all files in a folder to an S3 bucket using parallel uploads.

    Parameters:
    folder_path (str): The local folder path to upload.
    destination_blob_path (str): The destination path in the S3 bucket.
    max_workers (int): The maximum number of parallel uploads.
    """

    # Configure S3 client with increased connection pool size
    config = Config(
        region_name=AWS_REGION,
        retries={"max_attempts": 3, "mode": "standard"},
        max_pool_connections=100,
    )

    # S3 client initialization with credentials
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        config=config,
    )

    def upload_file(file_path):
        """
        Upload a single file to the specified S3 bucket.
        """
        try:
            # Get the remote path for the file
            key = os.path.relpath(file_path, folder_path)
            remote_path = os.path.join(destination_blob_path, key)

            # Upload the file
            s3_client.upload_file(file_path, AWS_BUCKET_NAME, remote_path)

        except FileNotFoundError as e:
            print(f"Error uploading {file_path}: {e}")

    # Use ThreadPoolExecutor to upload files in parallel
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = []
        # Walk through the folder and add each file to the upload queue
        for root, _, files in os.walk(folder_path):
            for file_name in files:
                file_path = os.path.join(root, file_name)
                futures.append(executor.submit(upload_file, file_path))

        # Wait for all uploads to complete
        for future in tqdm(as_completed(futures), total=len(futures)):
            # for future in as_completed(futures):
            future.result()
