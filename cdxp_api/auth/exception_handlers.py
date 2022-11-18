import logging
from fastapi import FastAPI, Request, status
from jose.exceptions import JOSEError

from .._shared.exception_handlers import ErrorResponse


def add_jwt_exception_handlers(app: FastAPI):
    @app.exception_handler(JOSEError)
    def JWTError_handler(request: Request, exception: JOSEError):
        logging.debug(f"generic jwt execption: {exception}")
        return ErrorResponse(str(exception), status.HTTP_401_UNAUTHORIZED)
