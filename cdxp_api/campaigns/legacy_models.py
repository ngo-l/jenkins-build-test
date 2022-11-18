from typing import Any, List, Optional
from uuid import UUID
from cdxp_api.campaigns.models import Campaign, CampaignType

from pydantic import constr

from .._shared.utils import APIModel, include, optional_all, required

from ..versions.models import VersionReadWithAudiences, VersionEstimation

Name = constr(min_length=10, max_length=50)


@required("id", "created_at", "updated_at", "creator")
class CampaignRead(Campaign):
    ...


class CampaignReadWithVersions(CampaignRead):
    versions: List[VersionReadWithAudiences]


class CampaignCreate(APIModel):
    name: Name
    type: CampaignType


@include("name", "type")
@optional_all
class CampaignUpdate(Campaign):
    ...


class CampaignEstimation(APIModel):
    success: bool
    versions: List[VersionEstimation]


class CampaignFilter(CampaignUpdate):
    ...


class LaunchResult(APIModel):
    version: UUID
    blob_path: str


class LaunchError(APIModel):
    detail: Any


class LaunchCallback(APIModel):
    results: List[LaunchResult] = []
    error: Optional[LaunchError]
