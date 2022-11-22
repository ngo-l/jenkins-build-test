from fastapi import APIRouter

from .emarsys.routes import router as emarsys_router

router = APIRouter(prefix="/email", tags=['email'])

router.include_router(emarsys_router)
