import logging
from fastapi import APIRouter, HTTPException

from .settings import WishListReminderSettings, wish_list_reminder_settings
from .service import WishListService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/wish_list")

service = WishListService()


@router.get("/config")
async def get_config() -> WishListReminderSettings:
    logger.debug('get wish list settings')
    return wish_list_reminder_settings


@router.get('/{target_date_str}')
async def load_blast_data(target_date_str):
    try:
        dataframe, blasted = service.load_blast_data(target_date_str)

        return {"blasted": blasted, "data": dataframe.to_json()}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))


@router.post("/{target_date_str}")
async def blast(target_date_str: str, chunksize: int = 1000, force: bool = False):
    try:
        service.send_wish_list_reminders(target_date_str, chunksize, force)
    except Exception as e:
        logger.error(str(e))
        raise HTTPException(status_code=500, detail=str(e))
