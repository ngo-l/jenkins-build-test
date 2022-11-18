from datetime import datetime
from enum import auto
from typing import TYPE_CHECKING, List, Literal, Optional, TypeAlias
from uuid import UUID
from cdxp_api._shared.models import CommonModel
from cdxp_api.audiences.models import AudienceSegment
from cdxp_api.products.models import ProductSegment

if TYPE_CHECKING:
    from ..campaigns.models import Campaign

from pydantic import EmailStr
from sqlmodel import Field, Relationship

from .._shared.utils import APIModel, StrEnum
from ..products.rules import ProductSegmentRuleGroup
from .sqltypes import JSONColumn

# ---
class VersionType(StrEnum):
    Standalone = auto()
    Control = auto()
    Test = auto()


# TODO
class VersionState(StrEnum):
    Drafted = auto()
    Processing = auto()  # Databricks Calculating
    Scheduled = auto()  # Databricks Calculation Done, Job added to scheduler
    Blasting = auto()  # Triggered Emarsys API
    Done = auto()
    # FIXME: FAILED
    Failed = auto()
    Cancelled = auto()


class VersionLanguage(StrEnum):
    Chinese = auto()
    English = auto()


class VersionAudienceIncludeLink(APIModel, table=True):
    version_id: UUID = Field(foreign_key="version.id", primary_key=True)
    audience_segment_id: UUID = Field(foreign_key="audience_segment.id", primary_key=True)


class VersionAudienceExcludeLink(APIModel, table=True):
    version_id: UUID = Field(foreign_key="version.id", primary_key=True)
    audience_segment_id: UUID = Field(foreign_key="audience_segment.id", primary_key=True)


class EmarsysBlastingConfig(APIModel):
    channel: Literal["Email"]
    platform: Literal["Emarsys"]
    event_id: int
    campaign_id: int
    schedule_at: datetime
    language: VersionLanguage
    subject_line: str


PlatformConfig: TypeAlias = EmarsysBlastingConfig


class Version(CommonModel, table=True):
    name: str
    type: VersionType
    state: VersionState = Field(
        VersionState.Drafted,
        nullable=False,
        sa_column_kwargs={"server_default": VersionState.Drafted},
    )
    audience_size: Optional[int]
    product_size: Optional[int]

    platform_config: PlatformConfig = Field(sa_column=JSONColumn())
    product_segments: List[ProductSegment] = Field(sa_column=JSONColumn(is_list=True))
    product_selection_matrix: List[List[str]] = Field(sa_column=JSONColumn(is_list=True))
    audience_segments_include: List[AudienceSegment] = Relationship(
        link_model=VersionAudienceIncludeLink
    )
    audience_segments_exclude: List[AudienceSegment] = Relationship(
        link_model=VersionAudienceExcludeLink
    )
    campaign_id: UUID = Field(foreign_key="campaign.id")
    campaign: "Campaign" = Relationship(back_populates="versions")


ProductSegmentRuleGroup.update_forward_refs()
