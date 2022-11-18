from fastapi import FastAPI

from .deps import JWTService
from .exception_handlers import add_jwt_exception_handlers
from .settings import JwtSettings


def setup_jwt(app: FastAPI, jwt_settings: JwtSettings = JwtSettings()):
    app.state.jwt_service = JWTService(jwt_settings)
    app.dependency_overrides[JWTService] = lambda: app.state.jwt_service

    add_jwt_exception_handlers(app)
