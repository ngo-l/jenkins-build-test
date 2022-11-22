from enum import Enum
import json
import logging
from typing import Optional
import pytz
from datetime import datetime

from src.reminders.abandoned_cart.event_factories.abadoned_cart_event import AbandonedCartEventFactory
from src.reminders.abandoned_cart.event_factories.sms_factory import SMSEventFactory
from .settings import AbandonedCartReminderSettings, abandoned_cart_reminder_settings
from src._shared.singleton import Singleton
from src.email.emarsys.service import EmarsysService
from src.email.emarsys.settings import emarsys_settings

from src._shared.blob_utils import blob_util
from ..blast_data_loader import load_parquet

FILE_FORMAT = 'parquet'

logger = logging.getLogger(__name__)

# TODO check necesscity of separating regions when there are more
# BlastType = Enum('BlastType', 'EMAIL SMS_CN SMS_HK')
# TODO move to DB
BlastType = Enum('BlastType', {
    'EMAIL': {
        'cron':  abandoned_cart_reminder_settings.crontab_email,
        'emarsys_event_id': abandoned_cart_reminder_settings.emarsys_event_id_email,
        'factoryClass': AbandonedCartEventFactory,
        'file_prefix': 'LC_Cart_Abandonement',
    },
    'SMS_CN': {
        'cron':  abandoned_cart_reminder_settings.crontab_sms_cn,
        'emarsys_event_id': abandoned_cart_reminder_settings.emarsys_event_id_sms_cn,
        'factoryClass': SMSEventFactory,
        'file_prefix': 'LC_Cart_Abandonement_SMS_CN',
    },
    'SMS_HK': {
        'cron':  abandoned_cart_reminder_settings.crontab_sms_hk,
        'emarsys_event_id': abandoned_cart_reminder_settings.emarsys_event_id_sms_hk,
        'factoryClass': SMSEventFactory,
        'file_prefix': 'LC_Cart_Abandonement_SMS_HK',
    }
})


class AbandonedCartService(metaclass=Singleton):
    def __init__(self,
                 settings: AbandonedCartReminderSettings = abandoned_cart_reminder_settings):
        self.settings = settings

    def get_pending_file_path(self, blast_type, blast_file_name) -> str:
        file_path = f"{self.settings.blast_data_path}/pending/{blast_type.value['file_prefix']}_{blast_file_name}.{FILE_FORMAT}"
        return file_path

    def load_blast_data(self, file_path: str):
        df, blasted = load_parquet(
            self.settings.container_name, file_path)

        if df is None:
            return None, False
        # Data scientist only handles Hong Kong time zone so far
        current_date = datetime.utcnow().replace(
            tzinfo=pytz.timezone("Asia/Hong_Kong")).date()

        logger.info(
            f"filtered by blast date: {current_date}, result size: {len(df)}")

        df.columns = df.columns.str.lower()
        df.reset_index(drop=True, inplace=True)
        df.drop_duplicates(subset=['vip_no', 'blast_date'])
        return df[df["blast_date"] <= current_date], blasted

    def send_abandoned_cart_reminders(self,
                                      blast_type: BlastType,
                                      # date string used to read data scientists' file
                                      blast_file_name: Optional[str] = None,
                                      chunksize: int = emarsys_settings.request_size_limit,
                                      force: bool = False,):
        # Prepare blast config
        if blast_file_name is None:
            blast_file_name = datetime.utcnow().replace(
                tzinfo=pytz.timezone("Asia/Hong_Kong")).strftime('%Y%m%d')

        event_factory = blast_type.value['factoryClass']()
        event_id = blast_type.value['emarsys_event_id']
        file_prefix = blast_type.value['file_prefix']
        file_path = self.get_pending_file_path(blast_type, blast_file_name)

        # FIXME: messy file paths - break blast data path to different parts
        src_file_path = file_path.replace(
            f"abfs://{self.settings.container_name}/", "")
        time_marker = datetime.now().strftime('%Y%m%d%H%M%S%f')
        target_file_path = src_file_path.replace(
            f"/pending/{file_prefix}_{blast_file_name}",
            f"/processed/{file_prefix}_{blast_file_name}_{time_marker}")
        filename = target_file_path.rsplit(".", 1)[0]
        batch_number = 1
        result = []

        abandoned_carts_data, blasted = self.load_blast_data(file_path)

        if blasted and not force:
            logger.info(
                'data already blasted and not in force mode, skipping blast')
            return

        if abandoned_carts_data is None:
            raise Exception(
                'failed to load abandoned cart reminder data, not sending')

        logger.debug(
            f"abandoned_carts_data(length = {len(abandoned_carts_data)}):{abandoned_carts_data}")

        if len(abandoned_carts_data) <= 0:
            logger.info(
                f'no data to blast from {src_file_path} after filtering')

        for i in range(0, len(abandoned_carts_data), chunksize):
            chunk = abandoned_carts_data[i: i + chunksize]
            result_file_path = f"{filename}_result-{batch_number}.json"

            logger.debug(f'writing result to {result_file_path}')

            chunk_result = EmarsysService().blast(chunk.to_dict('rows'),
                                                  event_id,
                                                  self.settings.product_list_maxlength,
                                                  event_factory,
                                                  self.settings.email_subject)
            result.append(chunk_result)
            blob_util.create(self.settings.container_name,
                             result_file_path,
                             json.dumps(result))
            batch_number += 1

        # write logs after sent
        logger.debug(f"blast result: {result}")

        # compromise for blob storage move folder overhead, use marker file instead
        blob_util.create(self.settings.container_name,
                         f"{src_file_path}/_BLASTED",
                         '')

        return result


abandoned_cart_service = AbandonedCartService()
