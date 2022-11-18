from fastapi import FastAPI
from sqlalchemy.engine import URL
from sqlalchemy.ext.asyncio import create_async_engine
from .deps import CRUDSession, yield_async_session
from .exception_handlers import add_sqlalchemy_exception_handlers
from .settings import DatabaseSettings
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import sessionmaker

database_settings = DatabaseSettings()
engine = create_async_engine(URL.create(**database_settings.dict()), echo=False)
async_session = sessionmaker(engine, expire_on_commit=False, class_=AsyncSession)

def setup_database(app: FastAPI, database_settings: DatabaseSettings = DatabaseSettings()):
    url = URL.create(**database_settings.dict())
    # TODO hook with env
    app.state.engine = engine
    app.dependency_overrides[CRUDSession] = yield_async_session
    add_sqlalchemy_exception_handlers(app)
