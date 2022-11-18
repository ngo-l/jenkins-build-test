from enum import auto
from typing import Any, Optional
from cdxp_api.database.sqltypes import JSONColumn
from sqlmodel import Field

from cdxp_api._shared.models import CommonModel
from cdxp_api.audiences.rules import AudienceRuleGroup

from .._shared.utils import APIModel, StrEnum, include, optional_all


# ---
class EstimationState(StrEnum):
    Available = auto()
    Processing = auto()
    Failure = auto()


class AudienceSegment(CommonModel, table=True):
    __tablename__ = "audience_segment"  # type: ignore

    name: str
    filters: AudienceRuleGroup = Field(sa_column=JSONColumn())
    size: Optional[int]
    estimation_state: EstimationState = Field(
        EstimationState.Available,
        nullable=False,
        sa_column_kwargs={"server_default": EstimationState.Available},
    )


class AudienceSegmentRead(AudienceSegment):
    ...


@include("name", "is_testing", "filters")
class AudienceSegmentCreate(AudienceSegment):
    ...


@optional_all
class AudienceSegmentUpdate(AudienceSegmentCreate):
    ...


@include("name")
class AudienceSegmentFilter(AudienceSegmentUpdate):
    ...


class EstimationResult(APIModel):
    size: int


class EstimationError(APIModel):
    detail: Any


class EstimationCallback(APIModel):
    result: Optional[EstimationResult]
    error: Optional[EstimationError]
