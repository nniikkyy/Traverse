# API Request / Response Samples

Base URL (local): `http://localhost:8000`

## 1) Health Check

### Request

```bash
curl http://localhost:8000/healthz
```

### Response

```json
{
  "status": "ok"
}
```

## 2) Agent Chat (Core AI Flow)

### Request

```bash
curl -X POST http://localhost:8000/ai/agent-chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Find me a local host for food and culture in Delhi with mid budget",
    "session_id": "demo-session-1"
  }'
```

### Response (example)

```json
{
  "session_id": "demo-session-1",
  "intent": "host_matching",
  "required_missing_fields": [],
  "selected_tools": [
    "HostMatchTool",
    "ItineraryTool"
  ],
  "host_candidates": [
    {
      "id": 1,
      "name": "Aarav Singh",
      "city": "Delhi",
      "bio": "Food and culture host",
      "languages": ["English", "Hindi"],
      "interests": ["food", "culture"],
      "rating": 4.8,
      "match_score": 95
    }
  ],
  "itinerary_days": [
    {
      "day": 1,
      "items": ["Old Delhi food walk", "Jama Masjid", "Chandni Chowk market"]
    }
  ],
  "safety_flags": [],
  "next_actions": [
    "Review top host suggestions.",
    "Pick one category route for Day 1.",
    "Confirm host request and budget range."
  ],
  "assistant_message": "I found host matches in Delhi and prepared a category-based itinerary.",
  "plan": [
    "HostMatchTool",
    "ItineraryTool"
  ],
  "execution_trace": [
    {
      "step": 1,
      "action": "HostMatchTool",
      "status": "completed",
      "output_keys": ["host_candidates", "best_host_id"],
      "description": "Find and score best matching local hosts."
    },
    {
      "step": 2,
      "action": "ItineraryTool",
      "status": "completed",
      "output_keys": ["itinerary_days"],
      "description": "Generate category-based itinerary days."
    }
  ],
  "critic_notes": [],
  "confidence": 0.9,
  "stop_reason": "goal_completed"
}
```

## 3) AI Safety Check

### Request

```bash
curl -X POST http://localhost:8000/ai/safety \
  -H "Content-Type: application/json" \
  -d '{"price": 1800, "avg_price": 900}'
```

### Response

```json
{
  "message": "Possible scam detected"
}
```

## 4) Host List by City

### Request

```bash
curl "http://localhost:8000/hosts?city=Delhi"
```

### Response (example)

```json
[
  {
    "id": 1,
    "user_id": 11,
    "name": "Aarav Singh",
    "city": "Delhi",
    "bio": "Food and culture host",
    "languages": ["English", "Hindi"],
    "interests": ["food", "culture"],
    "rating": 4.8,
    "availability": true
  }
]
```
