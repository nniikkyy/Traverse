from datetime import datetime

HOSTS = [
    {
        "id": 1,
        "user_id": 11,
        "name": "Aarav Singh",
        "city": "Delhi",
        "bio": "Food and culture host",
        "languages": ["English", "Hindi"],
        "interests": ["food", "culture"],
        "rating": 4.8,
        "availability": True
    },
    {
        "id": 2,
        "user_id": 12,
        "name": "Mira Nair",
        "city": "Goa",
        "bio": "Nightlife and local spots",
        "languages": ["English", "Hindi", "Konkani"],
        "interests": ["nightlife", "food"],
        "rating": 4.6,
        "availability": True
    }
]

TRIPS = []
MESSAGES = []
USERS = []
AGENT_MEMORY = {}


def add_message(payload):
    msg = {
        "id": len(MESSAGES) + 1,
        "sender_id": payload.sender_id,
        "receiver_id": payload.receiver_id,
        "message": payload.message,
        "timestamp": datetime.utcnow()
    }
    MESSAGES.append(msg)
    return msg
