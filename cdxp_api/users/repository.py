from sqlmodel import select
from typing import List
from ..users.models import User
from ..database.config import async_session
from uuid import UUID
from .._shared.singleton import Singleton


class UserRepository(metaclass=Singleton):
    async def get_user_emails_and_full_names_by_uuid(self, uuids: List[UUID]) -> List[tuple]:
        """
        Returns a list of tuples which contains uuid, email and full name

            Parameters:
                uuids (list): a list of UUIDs

            Returns:
                result.all():
                    a list of tuples containing the uuid, email and full name for each user.
                    If no uuid exists, this function will return an empty list.
        """
        async with async_session() as session:
            async with session.begin():
                stmt = select(User.id, User.email, User.full_name).where(User.id.in_(uuids))
                result = await session.execute(stmt)
        return result.all()


user_repository = UserRepository()
