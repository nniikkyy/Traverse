from fastapi import APIRouter

from models.schemas import TripCreate
from services.db import TRIPS
from services.matching import match_host
from services.db import HOSTS
from services.planner import generate_itinerary

router = APIRouter()


@router.post("")
def create_trip(payload: TripCreate):
    traveler = payload.model_dump()
    host = match_host(traveler, HOSTS)
    itinerary = generate_itinerary(
        payload.city, payload.interests, payload.budget)

    trip = {
        "id": len(TRIPS) + 1,
        "user_id": payload.user_id,
        "city": payload.city,
        "budget": payload.budget,
        "interests": payload.interests,
        "itinerary": itinerary,
        "host_id": host["id"] if host else None
    }
    TRIPS.append(trip)
    return trip


@router.get("")
def list_trips():
    return TRIPS
