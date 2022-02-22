import json
import logging
import time

import dask.dataframe as dd

from datetime import datetime

from .settings import AbandonedCartReminderSettings, abandoned_cart_reminder_settings
from src._shared.singleton import Singleton
from src._shared.settings import CommonSettings, common_settings
from src.email.emarsys.service import EmarsysService
from src._shared.blob_utils import blob_util

FILE_FORMAT = 'csv'
PREFIX = 'LC_Cart_Abandonement'

logger = logging.getLogger(__name__)


class AbandonedCartService(metaclass=Singleton):
    def __init__(self,
                 settings: AbandonedCartReminderSettings = abandoned_cart_reminder_settings):
        self.settings = settings

    def load_blast_data(self, date_str: str):
        # TODO: use strategy pattern
        # dask automatically load azure blob storage if start with abfs://
        blast_file_path = f"{self.settings.blast_data_path}/pending/{PREFIX}_{date_str}.{FILE_FORMAT}"
        df = dd.read_csv(
            blast_file_path,
            storage_options={
                'connection_string': common_settings.azure_storage_connection_string},
            sep=";",
            # parse_dates=['last_updated_time'],
            keep_default_na=False
        ).drop_duplicates(subset=['vip_no', 'blast_Date']).compute()

        result = df.loc[df["blast_Date"] ==
                        datetime.today().strftime('%Y-%m-%d')]

        return result

    def send_abandoned_cart_reminders(self, date_str: str = '{:%Y%m%d}'.format(datetime.now())):
        abandoned_carts_data = self.load_blast_data(date_str)
        logger.debug(
            f"abandoned_carts_data({len(abandoned_carts_data)}):{abandoned_carts_data}")

        # FIXME: messy file paths
        src_file_path = f"{self.settings.blast_data_path}/pending/{PREFIX}_{date_str}.{FILE_FORMAT}".replace(
            "abfs://", "").replace(f"{self.settings.container_name}/", "")
        target_file_path = src_file_path.replace(
            "/pending/", "/processed/")
        filename = target_file_path.rsplit(".", 1)[0]
        result_file_path = f"{filename}_result_{int(time.time())}.json"

        try:
            blob_util.move_blob(self.settings.container_name,
                                src_file_path,
                                target_file_path)
        except:
            logger.warn(
                f"failed to move blob({src_file_path}) to ({target_file_path}) in {self.settings.container_name}")

        result = EmarsysService().blast(abandoned_carts_data.to_dict('rows'),
                                        self.settings.emarsys_event_id,
                                        self.settings.product_list_maxlength,
                                        self.settings.email_subject)
        # write logs after sent
        logger.debug(f"blast result: {result}")
        blob_util.create(self.settings.container_name,
                         result_file_path,
                         json.dumps(result))

        return result
