from datetime import datetime
from uuid import uuid4

from sqlalchemy import Column, DateTime, text
from sqlalchemy.sql.functions import now
from sqlmodel import Column
from sqlmodel.sql.sqltypes import GUID


def UUIDColumn(primary_key: bool = True):
    return Column(
        GUID,
        primary_key=primary_key,
        nullable=False,
        default=uuid4,
    )


def JSONColumn(is_list: bool = False):
    from sqlalchemy.dialects.postgresql import JSONB

    return (
        Column(JSONB, nullable=False, default=list, server_default=text("'[]'::jsonb"))
        if is_list
        else Column(JSONB, nullable=False)
    )


def CreatedAtColumn():
    return Column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.now,
        server_default=now(),
    )


def UpdatedAtColumn():
    return Column(
        DateTime(timezone=True),
        nullable=False,
        default=datetime.now,
        onupdate=datetime.now,
        server_default=now(),
        server_onupdate=now(),  # type: ignore
    )
