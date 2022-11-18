import logging
from cdxp_api._shared.models import CommonModel

from fastapi import APIRouter, Depends, FastAPI
from starlette.middleware.cors import CORSMiddleware

from cdxp_api.audiences.rules import AudienceRuleGroup
from cdxp_api._shared.utils import create_rule_schemas
from cdxp_api.products.rules import ProductSegmentRuleGroup

from . import __version__
from .audiences.routes import router as audience_router
from .auth.config import setup_jwt
from .auth.deps import get_current_user
from .auth.routes import router as auth_router
from .campaigns.routes import router as campaign_router
from ._shared.exception_handlers import add_core_exception_handlers
from ._shared.settings import common_settings
from .database.config import setup_database
from .scheduler.scheduler import (
    scheduler,
    add_schedule_jobs,
    update_audience_seg_and_notification_status,
)
from .versions.routes import router as version_router
from .emarsys.routes import router as emarsys_router
from .scheduler.routes import router as scheduler_router
from .database.settings import DatabaseSettings
from sqlalchemy.engine import URL, create_engine


def init_cors(app, allowed_origins_regex: str):
    if allowed_origins_regex:
        logging.info(f"allowed origins pattern(s): {allowed_origins_regex}, {CORSMiddleware}")
        app.add_middleware(
            CORSMiddleware,
            allow_origin_regex=allowed_origins_regex,
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )


log_format = "%(asctime)s [%(levelname)s] %(name)s:%(lineno)d: %(message)s"
logging.basicConfig(
    format=log_format,
    level=common_settings.log_level,
    # datefmt="%Y-%m-%d %H:%M:%S"
)

app = FastAPI(title="CDXP-API", version=__version__)

init_cors(app, common_settings.allowed_origins_regex or "")

add_core_exception_handlers(app)
setup_database(app)
setup_jwt(app)

app.include_router(auth_router)

router = APIRouter()
router.include_router(audience_router)
router.include_router(campaign_router)
router.include_router(version_router)
router.include_router(emarsys_router)
router.include_router(scheduler_router)

app.include_router(router, dependencies=[Depends(get_current_user)])


def init_db():
    database_settings = DatabaseSettings()
    url = URL.create(**database_settings.dict())
    sync_engine = create_engine(url.set(drivername="postgresql"), echo=True)
    CommonModel.metadata.create_all(sync_engine)


@app.on_event("startup")
def startup():
    if common_settings.cron_enabled:
        scheduler.start()
        add_schedule_jobs(scheduler)

    if common_settings.db_should_create_all:
        init_db()


@app.get("/healthz", include_in_schema=False)
async def health_check():
    logging.debug("health check")
    ...


# TODO: cantain in some module
@app.get("/schemas/rules/audiences")
def audience_rule_schema():
    return create_rule_schemas(AudienceRuleGroup)


@app.get("/schemas/rules/products")
def product_rule_schema():
    return create_rule_schemas(ProductSegmentRuleGroup)


@app.get("/trigger/update_audience_seg_and_notification_status")
async def trigger_update_audience_seg_and_notification_status():
    await update_audience_seg_and_notification_status()
    return
