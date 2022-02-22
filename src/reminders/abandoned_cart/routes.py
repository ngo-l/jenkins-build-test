import logging
from fastapi import APIRouter, HTTPException

from .settings import AbandonedCartReminderSettings, abandoned_cart_reminder_settings
from .service import AbandonedCartService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/abandoned_cart")

service = AbandonedCartService()


@router.get("/config")
async def get_config() -> AbandonedCartReminderSettings:
    logger.debug('get abandoned cart settings')
    return abandoned_cart_reminder_settings


@router.get('/{target_date_str}')
async def load_blast_data(target_date_str):
    try:
        dataframe = service.load_blast_data(target_date_str)
        return dataframe.to_json()
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{target_date_str}")
async def blast(target_date_str: str):
    return service.send_abandoned_cart_reminders(target_date_str)
