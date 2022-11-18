from datetime import datetime, timedelta
import logging
from typing import Any, Optional, Type, TypeVar, Union
from uuid import uuid4

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import jwt
from jose.exceptions import JWTClaimsError
from pydantic import BaseModel, ValidationError
from sqlalchemy import select

from ..database.deps import CRUDSession
from ..users.models import User
from .models import CurrentUser, LoginRequest
from .settings import JwtSettings
from .utils import verify_password

T = TypeVar("T", bound=BaseModel)


class JWTService:
    jwt_settings: JwtSettings

    def __init__(self, jwt_settings: JwtSettings = Depends(lambda: JwtSettings())):
        self.jwt_settings = jwt_settings

    def create_access_token(self, subject: Union[str, int], user_claim: Any) -> str:
        now = datetime.utcnow()
        payload = {
            # "iss": None,
            # "aud": None,
            "sub": subject,
            "iat": now,
            "nbf": now,
            "exp": now + timedelta(seconds=self.jwt_settings.access_token_expires),
            "jti": str(uuid4()),
            "claims": user_claim,
        }
        encoded_jwt = jwt.encode(
            payload,
            self.jwt_settings.secret_key.get_secret_value(),
            algorithm=self.jwt_settings.algorithm,
        )
        return encoded_jwt

    def decode_access_token(self, token: str):
        logging.debug("decoding access token")
        payload = jwt.decode(
            token,
            self.jwt_settings.secret_key.get_secret_value(),
            algorithms=[self.jwt_settings.algorithm],
        )
        return payload

    def parse_user_claims(self, token: str, claim_model: Type[T]) -> T:
        payload = self.decode_access_token(token)
        claims = payload.get("claims")
        if not claims:
            raise JWTClaimsError("missing user claims form access token")
        try:
            return claim_model.parse_obj(claims)
        except ValidationError:
            raise JWTClaimsError(f"user claims content incorrect")


async def verify_login(login: LoginRequest, db: CRUDSession = Depends()) -> User:
    exec = await db.execute(select(User).filter(User.email == login.email))
    user: Optional[User] = exec.scalar_one_or_none()
    if not user or not verify_password(login.password.get_secret_value(), user.hashed_password):
        raise HTTPException(status.HTTP_401_UNAUTHORIZED, "Not authenticated")
    return user


http_bearer = HTTPBearer()


def get_current_user(
    cred: HTTPAuthorizationCredentials = Depends(http_bearer), jwt: JWTService = Depends()
) -> CurrentUser:
    token = cred.credentials
    claims = jwt.parse_user_claims(token, CurrentUser)
    return claims
