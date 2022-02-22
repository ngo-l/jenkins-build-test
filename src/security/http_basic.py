import secrets

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import HTTPBasic, HTTPBasicCredentials

from .settings import SecuritySettings, security_settings

security = HTTPBasic()


def authenticate(credentials: HTTPBasicCredentials = Depends(security)):
    correct_username = secrets.compare_digest(
        credentials.username, security_settings.basic_username)
    correct_password = secrets.compare_digest(
        credentials.password, security_settings.basic_password)
    if not (correct_username and correct_password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Basic"},
        )
    return credentials.username
