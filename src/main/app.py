import logging

from fastapi import FastAPI, Depends

from ..health_check import routes as health_check_routes
from .._shared.settings import CommonSettings, common_settings
from ..reminders import routes as reminders_routes
from ..email import routes as email_routes
from ..security import http_basic


def create_app(setting: CommonSettings = common_settings):
    logger = logging.getLogger(__name__)
    # TODO: move to config file
    log_format = "%(asctime)s [%(levelname)s] %(name)s:%(lineno)d: %(message)s"
    logging.basicConfig(
        format=log_format,
        level=setting.log_level,
        # datefmt="%Y-%m-%d %H:%M:%S"
    )
    app = FastAPI(title="LCJG Reminder Service")

    # TODO: IoC
    logger.debug('adding routes...')
    app.include_router(health_check_routes.router)

    # protected resources
    app.include_router(reminders_routes.router,
                       tags=["reminders"],
                       dependencies=[Depends(http_basic.authenticate)])
    app.include_router(email_routes.router,
                       tags=["email"],
                       dependencies=[Depends(http_basic.authenticate)])
    return app
