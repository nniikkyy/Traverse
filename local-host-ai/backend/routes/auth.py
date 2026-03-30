from fastapi import APIRouter

from models.schemas import UserCreate
from services.db import USERS

router = APIRouter()


@router.post("/signup")
def signup(payload: UserCreate):
    user = payload.model_dump()
    user["id"] = len(USERS) + 1
    USERS.append(user)
    return user
