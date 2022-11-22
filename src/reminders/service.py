import logging

import dask.dataframe as dd

from src._shared.singleton import Singleton
from src._shared.settings import common_settings
from .settings import ReminderCommonSettings, reminder_common_settings

FILE_FORMAT = 'csv'

logger = logging.getLogger(__name__)
LC_PRODUCT_FEED_FILE_PREFIX = 'lc_feed_api'


class ReminderCommonService(metaclass=Singleton):
    def __init__(self,
                 settings: ReminderCommonSettings = reminder_common_settings):
        self.settings = settings

    def load_lc_product_feed(self, filename: str):
        logger.debug('loading LC Product feed...')
        # dask automatically load azure blob storage if start with abfs://
        product_feed_file_path = f"{self.settings.product_feed_data_path}/{LC_PRODUCT_FEED_FILE_PREFIX}_{filename}.{FILE_FORMAT}"
        df = dd.read_csv(
            product_feed_file_path,
            # TODO: IoC
            storage_options={
                'connection_string': common_settings.azure_storage_connection_string.get_secret_value()},
            sep=";",
            keep_default_na=False,
            dtype={
                'brandCode': int,
                'lcStyleCode': int,
                'price': float,
                'stockLevel': int
            }
        ).compute()

        return df
