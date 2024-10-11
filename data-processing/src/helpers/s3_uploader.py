"""
Module to upload data to s3 bucket.
"""

import os
from pathlib import Path

import boto3
from dotenv import load_dotenv
from tqdm import tqdm

# Load environment variables from the .env file
load_dotenv()

# Access credentials from the environment variables
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_REGION = os.getenv("AWS_DEFAULT_REGION")


def upload_directory_to_s3(local_directory: Path, bucket_name: str, s3_prefix: str = ""):
    """
    Uploads the contents of a local directory to an S3 bucket using Pathlib for path management.

    Parameters:
    local_directory (str): The local directory path to upload.
    bucket_name (str): The name of the S3 bucket.
    s3_prefix (str): Optional prefix for the uploaded files in S3.
    """
    # Initialize an S3 client with the credentials
    s3_client = boto3.client(
        "s3",
        aws_access_key_id=AWS_ACCESS_KEY_ID,
        aws_secret_access_key=AWS_SECRET_ACCESS_KEY,
        region_name=AWS_REGION,
    )

    # Walk through the local directory
    print(f"Uploading {local_directory} to s3://{bucket_name}/{s3_prefix}")
    for file_path in tqdm(local_directory.rglob("*")):
        if file_path.is_file():
            # Construct the S3 path (key)
            relative_path = file_path.relative_to(local_directory)
            s3_path = Path(s3_prefix, relative_path).as_posix()

            # Upload the files
            s3_client.upload_file(str(file_path), bucket_name, s3_path)
