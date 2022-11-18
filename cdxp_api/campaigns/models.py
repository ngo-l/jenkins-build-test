from enum import auto
from typing import TYPE_CHECKING, List, Literal, Optional

from sqlalchemy import Column
from sqlalchemy.dialects.postgresql.json import JSONB
from cdxp_api._shared.models import CommonModel, Creator
from sqlmodel import Field, Relationship

from .._shared.utils import StrEnum

if TYPE_CHECKING:
    from ..database.schemas import Version

# FIXME: remove custom extended class
class CampaignState(StrEnum):
    Drafted = auto()
    Processing = auto()  # Launched Success, Campaign in Progress
    Done = auto()
    Failed = auto()
    Cancelled = auto()
    Testing = auto()
    Tested = auto()
    Error = auto()
    Launched = auto()


class CampaignType(StrEnum):
    SmallCampaigns = "Small Campaigns"
    NewIn = "New In"
    Enewsletter = "Enewsletter"
    OnAnniversary = "On:Anniversary"
    OnBirthday = "On:Birthday"
    OnBirthdayReminder = "On:Birthday Reminder"
    OnDowngrade = "On:Downgrade"
    OnDowngradeOptOut = "On:Downgrade opt-out"
    OnFPRP = "On:FPRP"
    OnPointReminder = "On:PointReminder"
    OnPreDowngrade = "On:Pre-downgrade"
    OnPreDowngradeOptOut = "On:Pre-downgrade opt-out"
    OnRetention = "On:Retention"
    OnUpgrade = "On:Upgrade"
    OnUpgradeOptOut = "On:Upgrade opt-out"
    Survey = "Survey"
    Replenishment = "Replenishment"
    Welcome = "Welcome"
    SecondPurchase = "Second Purchase"


class Campaign(CommonModel, table=True):
    name: str
    type: CampaignType
    state: CampaignState = Field(
        CampaignState.Drafted,
        nullable=False,
        # sa_column=Column(Enum(CampaignState)),
        sa_column_kwargs={"server_default": CampaignState.Drafted},
    )
    versions: List["Version"] = Relationship(
        back_populates="campaign", sa_relationship_kwargs={"cascade": "all, delete"}
    )
    creator: Creator = Field(sa_column=Column(JSONB, nullable=True))
