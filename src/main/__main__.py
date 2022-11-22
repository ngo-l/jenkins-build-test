
import uvicorn

from src._shared.settings import common_settings
from .app import create_app

# TODO: verify what file should this be in
app = create_app(common_settings)

uvicorn.run(
    app,
    host=common_settings.host,
    port=common_settings.port,
    root_path=common_settings.root_path,
    server_header=False,
    proxy_headers=False,
    date_header=False,
)
