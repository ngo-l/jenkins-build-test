import logging
from src.email.emarsys.service import EmarsysService
from fastapi import APIRouter, HTTPException

from .settings import AbandonedCartReminderSettings, abandoned_cart_reminder_settings
from .service import BlastType, AbandonedCartService

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/abandoned_cart")

service = AbandonedCartService()


@router.get("/config")
async def get_config() -> AbandonedCartReminderSettings:
    logger.debug('get abandoned cart settings')
    return abandoned_cart_reminder_settings


@router.get('/{blast_type_name}/{filename}')
# FIXME: auto convert to BlastType
async def load_blast_data(blast_type_name: str, filename: str, opt_in: bool = False):

    blast_type = BlastType[blast_type_name.upper()]
    file_path = service.get_pending_file_path(blast_type, filename)
    try:
        df, blasted = service.load_blast_data(file_path)
        data = df[0:df.size].to_dict('rows')
        if opt_in:
            data = EmarsysService().filter_opt_in(data)

    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

    return {"blasted": blasted, "data": data}


@router.post("/{blast_type_name}/{filename}")
# FIXME: auto convert to BlastType
async def blast(blast_type_name: str, filename: str, chunksize: int = 1000, force: bool = False):
    blast_type = BlastType[blast_type_name.upper()]
    try:
        service.send_abandoned_cart_reminders(
            blast_type,
            filename, chunksize, force)
    except Exception as e:
        logger.error(f"failed to send {blast_type_name}: {e}")
        raise HTTPException(status_code=500, detail=str(e))
