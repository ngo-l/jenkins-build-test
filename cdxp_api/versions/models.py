from datetime import datetime
from typing import List, Optional
from uuid import UUID
from cdxp_api import versions

from pydantic import validator

from .._shared.utils import APIModel, include, optional_all
from ..database.schemas import (
    AudienceSegment,
    PlatformConfig,
    ProductSegment,
    Version,
    VersionState,
    VersionType,
)


class VersionRead(APIModel):
    id: UUID
    campaign_id: UUID
    name: str
    type: VersionType
    state: VersionState
    platform_config: PlatformConfig
    product_segments: List[ProductSegment]
    product_selection_matrix: List[List[str]]

    created_at: datetime
    updated_at: datetime


class VersionReadWithAudiences(VersionRead):
    audience_segments_include: List[AudienceSegment]
    audience_segments_exclude: List[AudienceSegment]


def validate_product_selection(matrix: List[List[str]], values: dict) -> List[List[str]]:
    product_segment_ids = [segment.id for segment in values["product_segments"]]

    for row in matrix:
        for col in row:
            if col not in product_segment_ids:
                raise ValueError(f"productSegments do not contain value {col}")
    return matrix


class VersionCreate(APIModel):
    campaign_id: UUID
    name: str
    type: VersionType
    platform_config: PlatformConfig
    product_segments: List[ProductSegment]
    product_selection_matrix: List[List[str]]
    audience_segment_include_ids: List[UUID]
    audience_segment_exclude_ids: List[UUID] = []

    _validate_product_selection = validator("product_selection_matrix", allow_reuse=True)(
        validate_product_selection
    )


class VersionUpdate(APIModel):
    name: Optional[str]
    type: Optional[VersionType]
    platform_config: Optional[PlatformConfig]
    product_segments: Optional[List[ProductSegment]]
    product_selection_matrix: Optional[List[List[str]]]
    audience_segment_include_ids: Optional[List[UUID]]
    audience_segment_exclude_ids: Optional[List[UUID]]

    _validate_product_selection = validator("product_selection_matrix", allow_reuse=True)(
        validate_product_selection
    )


class VersionFilter(APIModel):
    name: Optional[str]
    type: Optional[VersionType]


class VersionEstimation(APIModel):
    version_id: UUID
    audience_size: int
    product_size: int


class SendTestMailRequest(APIModel):
    email_addresses: List[str]
