"""
Settings module
"""

import logging
from functools import lru_cache

from pydantic_settings import BaseSettings

logger = logging.getLogger(__name__)


@lru_cache()
def get_settings():
    """
    Get the settings.
    """
    return Settings()


class Settings(BaseSettings):
    """
    Settings class.
    """

    MAPBOX_USER: str
    MAPBOX_TOKEN: str

    def validate_config(self):
        """
        Validate the configuration.
        """
        if not self.MAPBOX_USER:
            raise ValueError("MAPBOX_USER is not set")
        if not self.MAPBOX_TOKEN:
            raise ValueError("MAPBOX_TOKEN is not set")

        return self.validate_dir()
