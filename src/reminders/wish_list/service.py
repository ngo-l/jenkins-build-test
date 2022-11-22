import json
import logging
from typing import Optional
import pytz

from datetime import datetime

from src.reminders.wish_list.event_factories.wish_list_event import WishListEventFactory


from .settings import WishListReminderSettings, wish_list_reminder_settings
from src._shared.singleton import Singleton
from src.email.emarsys.service import EmarsysService
from src.email.emarsys.settings import emarsys_settings
from src._shared.blob_utils import blob_util
from ..blast_data_loader import load_parquet

FILE_FORMAT = 'parquet'
PREFIX = 'LC_Wish_List_Abandonement'

logger = logging.getLogger(__name__)


# FIXME: regroup services by 1 class and instantiate with differences
class WishListService(metaclass=Singleton):
    def __init__(self,
                 settings: WishListReminderSettings = wish_list_reminder_settings):
        self.settings = settings

    def load_blast_data(self, date_str: str):
        blast_file_path = f"{self.settings.blast_data_path}/pending/{PREFIX}_{date_str}.{FILE_FORMAT}"
        df, blasted = load_parquet(
            self.settings.container_name, blast_file_path)
        if df is None:
            return None, False

        # Data scientist only handles Hong Kong time zone so far
        current_date = datetime.utcnow().replace(
            tzinfo=pytz.timezone("Asia/Hong_Kong")).date()

        logger.info(
            f"filtered by blast date: {current_date}, result size: {len(df)}")

        # df.columns = df.columns.str.lower()
        # df.reset_index(drop=True, inplace=True)
        # df.drop_duplicates(subset=['vip_no', 'blast_date'])
        return df[df["blast_date"] <= current_date], blasted

    def send_wish_list_reminders(self,
                                 # date string used to read data scientists' file
                                 date_str: Optional[str] = None,
                                 chunksize: int = emarsys_settings.request_size_limit,
                                 force: bool = False):
        if date_str is None:
            date_str = datetime.utcnow().replace(
                tzinfo=pytz.timezone("Asia/Hong_Kong")).strftime('%Y%m%d')

        # FIXME: messy file paths - break blast data path to different parts
        src_file_path = f"{self.settings.blast_data_path}/pending/{PREFIX}_{date_str}.{FILE_FORMAT}"\
            .replace(f"abfs://{self.settings.container_name}/", "")
        time_marker = datetime.now().strftime('%Y%m%d%H%M%S%f')
        target_file_path = src_file_path.replace(
            f"/pending/{PREFIX}_{date_str}", f"/processed/{PREFIX}_{date_str}_{time_marker}")
        filename = target_file_path.rsplit(".", 1)[0]
        batch_number = 1
        result = []

        wish_lists_data, blasted = self.load_blast_data(date_str)

        if blasted and not force:
            logger.info(
                'data already blasted and not in force mode, skipping blast')
            return

        if wish_lists_data is None:
            raise Exception(
                'failed to load abandoned wish list reminder data, not sending')
        logger.debug(
            f"data size of blast data:{len(wish_lists_data)}")
        logger.debug(wish_lists_data)

        if len(wish_lists_data) <= 0:
            logger.info(
                f'no data to blast from {src_file_path} after filtering')
        
        # process chunk of data, each chunk has opt-out contacts screened off implicitly
        # TODO: extract opt-in/opt-out control
        for i in range(0, len(wish_lists_data), chunksize):
            chunk = wish_lists_data[i: i + chunksize]
            result_file_path = f"{filename}_result-{batch_number}.json"
            logger.debug(f'writing result to {result_file_path}')
            chunk_result = EmarsysService().blast(chunk.to_dict('rows'),
                                                  self.settings.emarsys_event_id,
                                                  self.settings.product_list_maxlength,
                                                  WishListEventFactory(),
                                                  self.settings.email_subject)
            result.append(chunk_result)
            blob_util.create(self.settings.container_name,
                             result_file_path,
                             json.dumps(result))
            batch_number += 1

        # write logs after sent
        logger.debug(f"blast result: {result}")

        blob_util.create(self.settings.container_name,
                         f"{src_file_path}/_BLASTED",
                         '')

        return result
