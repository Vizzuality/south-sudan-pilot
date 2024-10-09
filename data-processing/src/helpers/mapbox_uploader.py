"""
Module to upload the mbtiles file to Mapbox.
"""

import logging
import os
import subprocess
from pathlib import Path
from time import sleep

import requests
from tqdm import tqdm

logger = logging.getLogger(__name__)


def upload_to_mapbox(source: Path, display_name: str, username: str, token: str):
    """
    Upload the mbtiles file to Mapbox.
    """
    logger.info("Uploading to Mapbox...")

    tileset_name = source.stem
    mapbox_credentials = get_s3_credentials(username, token)

    upload_status = upload_to_s3(source, mapbox_credentials)
    logger.info(upload_status)
    result = link_to_mapbox(username, token, mapbox_credentials, tileset_name, display_name)
    logger.info(result)

    return result


def get_s3_credentials(user: str, token: str) -> dict:
    """
    Get the S3 credentials from Mapbox.
    """
    r = requests.get(f"https://api.mapbox.com/uploads/v1/{user}/credentials?access_token={token}")
    r.raise_for_status()
    return r.json()


def set_s3_credentials(credentials: dict) -> None:
    """
    Set the S3 credentials as environment variables.
    """
    os.environ["AWS_ACCESS_KEY_ID"] = credentials["accessKeyId"]
    os.environ["AWS_SECRET_ACCESS_KEY"] = credentials["secretAccessKey"]
    os.environ["AWS_SESSION_TOKEN"] = credentials["sessionToken"]


def upload_to_s3(source: Path, credentials: dict) -> int:
    """
    Upload the mbtiles file to S3. https://docs.mapbox.com/help/tutorials/upload-curl/#stage-your-file-on-amazon-s3
    """
    logger.info("Uploading to S3...")
    set_s3_credentials(credentials)
    status = subprocess.run(
        f"aws s3 cp {source} s3://{credentials['bucket']}/{credentials['key']} --region us-east-1",
        shell=True,
        check=True,
    )

    if status.returncode != 0:
        raise ValueError(f"Upload to S3 failed with status {status.returncode}")

    return status


def link_to_mapbox(
    username: str, token: str, credentials: dict, tileset_name: str, display_name=None
):
    """
    Link the uploaded file to Mapbox. https://docs.mapbox.com/help/tutorials/upload-curl/#link-your-file-to-mapbox
    """

    def upload_status(upload_id):
        url = f"https://api.mapbox.com/uploads/v1/{username}/{upload_id}?access_token={token}"
        s = requests.get(url)

        s.raise_for_status()

        if s.json()["error"]:
            raise ValueError(s.json()["error"])

        return s.json()["complete"], s.json()["progress"]

    if not display_name:
        display_name = tileset_name

    # Create the tileset upload
    url = f"https://api.mapbox.com/uploads/v1/{username}?access_token={token}"
    body = {
        "url": f"https://{credentials.get('bucket', '')}.s3.amazonaws.com/{credentials.get('key')}",
        "tileset": f"{username}.{tileset_name}",
        "name": f"{display_name}",
    }
    r = requests.post(url, json=body)
    r.raise_for_status()

    upload_id = r.json()["id"]
    # Progress bar to show upload status in Mapbox
    with tqdm(total=100) as pbar:
        pbar.set_description("Linking tileset to Mapbox")
        pbar.update(0)

        # Check the upload status
        status = False
        while status is False:
            sleep(5)
            status, progress = upload_status(upload_id)
            pbar.update(round(progress * 100))

    return status
