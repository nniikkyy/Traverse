from fastapi import APIRouter, Query

from services.db import HOSTS

router = APIRouter()


@router.get("")
def list_hosts(city: str = Query(default="")):
    if city:
        return [h for h in HOSTS if h["city"].lower() == city.lower()]
    return HOSTS
