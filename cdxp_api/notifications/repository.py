import logging
from uuid import UUID
from .models import NotificationStatus, AudienceSegmentExportEmail
from typing import List
from ..database.config import async_session
from ..users.models import User
from sqlmodel import select, update
from .models import NotificationStatus, AudienceSegmentExportEmail
from ..audiences.models import AudienceSegment, EstimationState
from ..database.config import async_session
from .._shared.singleton import Singleton


class NotificationRepository(metaclass=Singleton):
    async def set_notification_expiries(self):
        # with Session(engine) as session:
        async with async_session() as session:
            async with session.begin():
                stmt = (
                    update(AudienceSegmentExportEmail)
                    .where(AudienceSegmentExportEmail.audience_segment_id == AudienceSegment.id)
                    .where(
                        AudienceSegment.estimation_state == EstimationState.Failure,
                        AudienceSegmentExportEmail.status != NotificationStatus.FAILED,
                    )
                    .values(status=NotificationStatus.FAILED)
                    .returning(
                        AudienceSegmentExportEmail.triggered_by,
                        AudienceSegmentExportEmail.audience_segment_id,
                    )
                    .execution_options(synchronize_session=False)
                )
                result = await session.execute(stmt)
                return result.rowcount, [
                    {"user_id": user_id, "audience_segment_id": audience_segment_id}
                    for user_id, audience_segment_id in result
                ]

    async def find_pending_notifications(self, audience_segment_id):
        async with async_session() as session:
            async with session.begin():
                stmt = (
                    select(
                        AudienceSegmentExportEmail.audience_segment_id,
                        AudienceSegmentExportEmail.status,
                        User.email,
                    )
                    .where(
                        AudienceSegmentExportEmail.audience_segment_id == audience_segment_id,
                        AudienceSegmentExportEmail.status == NotificationStatus.PENDING,
                    )
                    .join(
                        User,
                        User.id == AudienceSegmentExportEmail.triggered_by,
                    )
                )
                results = await session.execute(stmt)
                notifications = [
                    (audience_segment_id, status, email)
                    for audience_segment_id, status, email in results
                ]

                return notifications

    async def update_notification_status(
        self, audience_segment_id: UUID, status: NotificationStatus
    ):
        async with async_session() as session:
            async with session.begin():
                stmt = (
                    update(AudienceSegmentExportEmail)
                    .where(AudienceSegmentExportEmail.audience_segment_id == audience_segment_id)
                    .values(status=status)
                    .execution_options(synchronize_session=False)
                )
                result = await session.execute(stmt)
                return result.rowcount


notification_repository = NotificationRepository()
