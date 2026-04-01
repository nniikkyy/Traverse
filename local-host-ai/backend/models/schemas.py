from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field


class UserCreate(BaseModel):
    name: str
    email: str
    type: str = Field(pattern="^(traveler|host)$")
    language: str


class HostProfile(BaseModel):
    id: int
    user_id: int
    name: str
    city: str
    bio: str
    languages: List[str]
    interests: List[str]
    rating: float
    availability: bool


class TripCreate(BaseModel):
    user_id: int
    city: str
    budget: str
    interests: List[str]
    language: str


class TripResponse(BaseModel):
    id: int
    user_id: int
    city: str
    budget: str
    interests: List[str]
    itinerary: dict
    host_id: Optional[int] = None


class MessageCreate(BaseModel):
    sender_id: int
    receiver_id: int
    message: str


class MessageOut(BaseModel):
    id: int
    sender_id: int
    receiver_id: int
    message: str
    timestamp: datetime


class AgentChatPayload(BaseModel):
    message: str
    session_id: Optional[str] = None
    city: Optional[str] = None
    interests: Optional[List[str]] = None
    budget: Optional[str] = None
    language: Optional[str] = "English"
    quoted_price: Optional[float] = None
    avg_price: Optional[float] = None


class AgentChatResponse(BaseModel):
    session_id: str
    intent: str
    required_missing_fields: List[str]
    selected_tools: List[str]
    host_candidates: List[dict]
    itinerary_days: List[dict]
    safety_flags: List[str]
    next_actions: List[str]
    assistant_message: str
    plan: List[str]
    execution_trace: List[dict]
    critic_notes: List[str]
    confidence: float
    stop_reason: str
