# Traverse Architecture

## High-Level Diagram

```mermaid
flowchart LR
    U[Tourist / Host User] --> F[Next.js Frontend\napp + components]
    F -->|REST API| B[FastAPI Backend\nlocal-host-ai/backend]

    B --> R1[/routes/ai.py/]
    B --> R2[/routes/trips.py/]
    B --> R3[/routes/messages.py/]

    R1 --> S1[services/agent.py\nOrchestrator]
    S1 --> T1[HostMatchTool\nservices/matching.py]
    S1 --> T2[ItineraryTool\nservices/planner.py]
    S1 --> T3[SafetyTool\nservices/safety.py]

    S1 --> M[(In-memory Session Memory\nAGENT_MEMORY)]
    S1 --> OAI[OpenAI API\nGPT-5.3]

    T1 --> D[(Mock Data Layer\nservices/db.py)]
    R2 --> D
    R3 --> D
```

## Data / Request Flow

1. User sends travel request from chat UI.
2. Frontend calls `POST /ai/agent-chat`.
3. `services/agent.py` extracts intent, city, interests, budget, and routes tool calls.
4. Host matching, itinerary generation, and safety checks run as tools.
5. Structured response returns:
   - `intent`
   - `selected_tools`
   - `host_candidates`
   - `itinerary_days`
   - `safety_flags`
   - `next_actions`
6. Frontend renders result cards and action guidance.

## Deployment Architecture

- Frontend: Vercel (Next.js)
- Backend: Render (FastAPI)
- CORS controlled via `ALLOWED_ORIGINS`
- Optional external model provider: OpenAI
