
from sqlmodel import update, select
from typing import List
from datetime import datetime, timedelta
from ..database.config import async_session
from .models import AudienceSegment, EstimationState
from .._shared.singleton import Singleton


class AudienceRepository(metaclass=Singleton):

    async def update_many_audience_segment_estimation_state(self):
        async with async_session() as session:
            async with session.begin():
                stmt = (
                    update(AudienceSegment)
                    .where(
                        (AudienceSegment.estimation_state == EstimationState.Processing),
                        (AudienceSegment.updated_at < datetime.now() - timedelta(hours=1))
                    ).values(
                       estimation_state = EstimationState.Failure
                    )
                )
                result = await session.execute(stmt)
        return result.rowcount

audience_repository = AudienceRepository()
