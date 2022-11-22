
import logging
from typing import Tuple
import dask.dataframe as dd
from dask.dataframe import DataFrame

from src._shared.settings import common_settings
from src._shared.blob_utils import blob_util

logger = logging.getLogger(__name__)


def load_parquet(container_name: str, blast_file_path: str) -> Tuple[DataFrame, bool]:
    # TODO: use strategy pattern
    # dask automatically load azure blob storage if start with abfs://
    logger.debug(
        f'loading blast file, path: {blast_file_path}')
    blob_path = blast_file_path.replace(
        f'abfs://{container_name}/', '')
    if not blob_util.exists(container_name, f"{blob_path}/_SUCCESS"):
        logger.warning(f'parquet _SUCCESS file in {blob_path} not found')
        return None, False

    blasted = blob_util.exists(container_name, f"{blob_path}/_BLASTED")
    df = dd.read_parquet(
        blast_file_path,
        storage_options={
            'connection_string': common_settings.azure_storage_connection_string.get_secret_value()},
        # parse_dates=['last_updated_time'],
        keep_default_na=False,
        chunksize=1000,
        engine='pyarrow'
    ).compute()

    # df.columns = df.columns.str.lower()
    # df.reset_index(drop=True, inplace=True)
    # df.drop_duplicates(subset=['vip_no', 'blast_date'])

    return df, blasted
