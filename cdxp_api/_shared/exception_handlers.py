from typing import Any

from fastapi import FastAPI, HTTPException, Request, status
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse


class ErrorResponse(JSONResponse):
    def __init__(self, detail: Any, status_code: int):
        super(JSONResponse, self).__init__({"detail": detail}, status_code)


def add_core_exception_handlers(app: FastAPI):
    @app.exception_handler(HTTPException)
    def http_exception_handler(request: Request, exception: HTTPException):
        return ErrorResponse(exception.detail, exception.status_code)

    @app.exception_handler(Exception)
    def internal_server_error_handler(request: Request, exception: Exception):
        return ErrorResponse("Internal Server Error", status.HTTP_500_INTERNAL_SERVER_ERROR)

    @app.exception_handler(RequestValidationError)
    def validaition_error_handler(request: Request, exception: RequestValidationError):
        errors = [{k: v for k, v in error.items() if k != "ctx"} for error in exception.errors()]
        return ErrorResponse(errors, status.HTTP_422_UNPROCESSABLE_ENTITY)
