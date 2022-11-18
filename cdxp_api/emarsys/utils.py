from base64 import b64encode
from hashlib import sha1
import logging
from cdxp_api._shared.settings import common_settings

# TODO: move to util
import dask.dataframe as dd
from pandas import DataFrame


# FIXME: useless function
def base64Sha1(value: str):
    s = sha1()
    s.update(value.encode("utf-8"))
    h = s.hexdigest()
    return b64encode(h.encode()).decode()


def load_parquet(blast_file_path: str) -> DataFrame:
    # TODO: use strategy pattern
    # dask automatically load azure blob storage if start with abfs://
    if not blast_file_path.startswith("abfs://"):
        blast_file_path = blast_file_path.replace("/mnt", "abfs://")

    logging.debug(f"loading blast file, path: {blast_file_path}")

    # if not blob_util.exists(container_name, f"{blob_path}/_SUCCESS"):
    #     logging.warning(f"parquet _SUCCESS file in {blob_path} not found")
    #     return None

    df = dd.read_parquet(
        blast_file_path,
        storage_options={
            "connection_string": common_settings.databricksshare_connection_string.get_secret_value()
        },
        # keep_default_na=False,
        # chunksize=1000,
        # engine="pyarrow",
    ).compute()

    return df
