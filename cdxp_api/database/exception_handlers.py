from asyncpg.exceptions import ForeignKeyViolationError
from fastapi import FastAPI, Request, status
from sqlalchemy.exc import (
    IntegrityError,
    InvalidRequestError,
    NoResultFound,
    ProgrammingError,
)

from .._shared.exception_handlers import ErrorResponse


def add_sqlalchemy_exception_handlers(app: FastAPI):
    @app.exception_handler(NoResultFound)
    def no_resultF_found_handler(request: Request, exception: NoResultFound):
        return ErrorResponse(str(exception), status.HTTP_404_NOT_FOUND)

    @app.exception_handler(ForeignKeyViolationError)
    def foreign_key_violation_error(request: Request, exception: ForeignKeyViolationError):
        return ErrorResponse(str(exception), status.HTTP_400_BAD_REQUEST)

    @app.exception_handler(InvalidRequestError)
    def invalid_request_error_handler(request: Request, exception: InvalidRequestError):
        return ErrorResponse(str(exception), status.HTTP_400_BAD_REQUEST)

    @app.exception_handler(IntegrityError)
    def integrity_error_handler(request: Request, exception: IntegrityError):
        full_message: str = exception.orig.args[0]
        detail = full_message.split("DETAIL:")[-1].strip()
        return ErrorResponse(detail, status.HTTP_400_BAD_REQUEST)

    @app.exception_handler(ProgrammingError)
    def programming_error_handler(request: Request, exception: ProgrammingError):
        full_message: str = exception.orig.args[0]
        detail = full_message.split(":")[-1].strip()
        return ErrorResponse(detail, status.HTTP_400_BAD_REQUEST)
