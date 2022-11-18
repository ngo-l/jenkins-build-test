from databricks_cli.sdk.api_client import ApiClient
from databricks_cli.sdk.service import JobsService

from .settings import DatabricksSettings

databricks_settings = DatabricksSettings()

databricks_client = ApiClient(
    host=databricks_settings.host, token=databricks_settings.token.get_secret_value()
)
databricks_jobs_service = JobsService(databricks_client)
