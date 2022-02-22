from src._shared.settings import common_settings
import logging
import time
from azure.storage.blob import BlobServiceClient

# blob_service_client = BlobServiceClient.from_connection_string(common_settings.azure_storage_connection_string)

# def create_blob(container_name: str, filename: str):
#     blob_service_client.get_container_client(container_name)

logger = logging.getLogger(__name__)


class BlobUtil:
    def __init__(self,
                 storage_account_connection_string: str = common_settings.azure_storage_connection_string):
        self.storage_account_connection_string = storage_account_connection_string
        self.blob_service_client = BlobServiceClient.from_connection_string(
            storage_account_connection_string)

    def create(self, container_name: str, blob_path: str, data):
        logger.debug(f"writing to {container_name} > {blob_path}")
        
        # TODO: refactor to reuse the logic
        while True:
            blob = self.blob_service_client.get_blob_client(
            container_name,
            blob_path)
            if not blob.exists():
                break

            filename,ext = blob_path.rsplit(".", 1)
            blob_path = f"{filename}(1).{ext}"
        blob.upload_blob(data)


    def exists(self, container_name: str, blob_path: str):
        blob = self.blob_service_client.get_blob_client(
            container_name,
            blob_path)
        return blob.exists()

    def move_blob(self,
                  container_name: str,
                  src_path: str,
                  target_path: str,
                  timeout: int = 300):
        logger.debug(f'start moving {src_path} to {target_path}')
        src_blob = self.blob_service_client.get_blob_client(
            container_name,
            src_path)

        if not src_blob.exists():
            # FIXME: identify what exception/error to be raised
            raise FileNotFoundError('source blob not found to copy')

        src_url = src_blob.url

        while True:
            target_blob = self.blob_service_client.get_blob_client(
                container_name,
                target_path)
            if not target_blob.exists():
                break

            filename, ext = target_path.rsplit(".", 1)
            target_path = f"{filename}(1).{ext}"

        # https://docs.microsoft.com/en-us/python/api/azure-storage-blob/azure.storage.blob.blobclient?view=azure-python#azure-storage-blob-blobclient-start-copy-from-url
        target_blob.start_copy_from_url(src_url)
        props = target_blob.get_blob_properties()
        time_waited = 0
        while props.copy.status == 'pending':
            if time_waited < timeout:
                time.sleep(1)
            else:
                raise TimeoutError(
                    'Timed out waiting for copy to complete.')

        src_blob.delete_blob()

        return props.copy.status


blob_util = BlobUtil()
