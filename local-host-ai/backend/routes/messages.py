from fastapi import APIRouter

from models.schemas import MessageCreate
from services.db import MESSAGES, add_message

router = APIRouter()


@router.post("")
def send_message(payload: MessageCreate):
    return add_message(payload)


@router.get("")
def list_messages():
    return MESSAGES
