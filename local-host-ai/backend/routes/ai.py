from fastapi import APIRouter
from pydantic import BaseModel
from models.schemas import AgentChatPayload, AgentChatResponse

from services.matching import match_host
from services.planner import generate_itinerary
from services.safety import detect_scam
from services.db import HOSTS
from services.agent import run_agent

router = APIRouter()


class MatchPayload(BaseModel):
    city: str
    interests: list[str]
    language: str


class ItineraryPayload(BaseModel):
    city: str
    interests: list[str]
    budget: str


class SafetyPayload(BaseModel):
    price: float
    avg_price: float


@router.post("/match")
def ai_match(payload: MatchPayload):
    traveler = payload.model_dump()
    return {"host": match_host(traveler, HOSTS)}


@router.post("/itinerary")
def ai_itinerary(payload: ItineraryPayload):
    return generate_itinerary(payload.city, payload.interests, payload.budget)


@router.post("/safety")
def ai_safety(payload: SafetyPayload):
    return {"message": detect_scam(payload.price, payload.avg_price)}


@router.post("/agent-chat", response_model=AgentChatResponse)
def ai_agent_chat(payload: AgentChatPayload):
    return run_agent(payload.model_dump())
