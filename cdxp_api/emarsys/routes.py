from fastapi import APIRouter

from .settings import EmarsysSettings, emarsys_settings

router = APIRouter(prefix="/emarsys", tags=["Emarsys", "Email", "Notification"])


@router.get("/config")
async def get_emarsys_config() -> EmarsysSettings:
    return emarsys_settings
