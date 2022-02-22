import logging
from fastapi import APIRouter, Response, status

from .service import ReminderCommonService
from .abandoned_cart import routes as abandoned_cart_routes

logger = logging.getLogger(__name__)
router = APIRouter(prefix="/reminders")
reminderCommonService = ReminderCommonService()

router.include_router(abandoned_cart_routes.router)

@router.get("/lc/product-feed/{filename}")
async def get_latest_lc_product_feed(filename: str):
    dataframe = reminderCommonService.load_lc_product_feed(filename)
    logger.debug(dataframe)
    return dataframe.to_json()

