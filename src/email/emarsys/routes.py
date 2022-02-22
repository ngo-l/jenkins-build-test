import logging
from fastapi import APIRouter

from .settings import emarsys_settings
from .service import EmarsysService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/emarsys", tags=['email', 'Emarsys'])

@router.get("/config")
async def get_config():
    return emarsys_settings

@router.post("/")
async def blast():
    logger.debug('test')
    return 'emarsys blast test'
