from enum import auto
from sqlmodel import Field
from uuid import UUID

from cdxp_api._shared.models import CommonModel

from .._shared.utils import StrEnum


class NotificationStatus(StrEnum):
    PENDING = auto()
    SENT = auto()
    FAILED = auto()


# intertrim solution
class AudienceSegmentExportEmail(CommonModel, table=True):
    __tablename__ = "audience_segment_export_emails"

    triggered_by: UUID
    audience_segment_id: UUID
    status: NotificationStatus = Field(default=NotificationStatus.PENDING)
