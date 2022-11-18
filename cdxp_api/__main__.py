from cdxp_api._shared.settings import common_settings
import uvicorn


uvicorn.run(
    "cdxp_api.app:app",
    host=common_settings.host,
    port=common_settings.port,
    root_path=common_settings.root_path,
    server_header=False,
    proxy_headers=False,
    date_header=False,
)
