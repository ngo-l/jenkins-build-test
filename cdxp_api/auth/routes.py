from fastapi import APIRouter, Depends
from fastapi.encoders import jsonable_encoder

from ..database.deps import CRUDSession
from ..users.models import User
from .deps import JWTService, get_current_user, verify_login
from .models import CurrentUser, LoginResponse, UserCreate, UserRead
from .utils import hash_password

router = APIRouter(tags=["Auth"])


@router.post("/auth/register", response_model=UserRead)
async def register(
    new_user: UserCreate,
    db: CRUDSession = Depends(),
):
    hashed_password = hash_password(new_user.password.get_secret_value())
    user = User(**new_user.dict(), hashed_password=hashed_password)
    await db.create(user)
    return user


@router.post("/auth/login", response_model=LoginResponse)
async def login(
    verified_user: User = Depends(verify_login),
    jwt: JWTService = Depends(),
):
    user = UserRead.parse_obj(verified_user)
    user_claim = jsonable_encoder(user)
    access_token = jwt.create_access_token(subject=str(user.id), user_claim=user_claim)  # type: ignore
    return LoginResponse(access_token=access_token)


@router.get("/users/me", response_model=CurrentUser)
async def me(user: CurrentUser = Depends(get_current_user)):
    return user
