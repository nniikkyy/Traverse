# Traverse

Traverse is a host marketplace platform for India where tourists connect with local hosts and get AI-generated category-based plans.

## Repository

- GitHub: `https://github.com/nniikkyy/Traverse`

## Tech Stack

- Frontend: Next.js App Router + Tailwind CSS
- Backend: FastAPI
- AI Layer: OpenAI + tool orchestration (host matching, itinerary generation, safety checks)

## Monorepo Structure

- `app/`, `components/`: Main Next.js frontend (submission UI)
- `local-host-ai/backend/`: FastAPI backend with AI routes and services
- `render.yaml`: Render deployment blueprint for backend
- `docs/`: Submission documents (architecture, API samples, evidence checklist)

## How To Run Locally

### Prerequisites

- Node.js 18+
- Python 3.10+

### 1. Run Backend (FastAPI)

```bash
cd local-host-ai/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
export OPENAI_API_KEY=your_openai_api_key
export ALLOWED_ORIGINS=http://localhost:3000,http://localhost:3001,http://localhost:3002
uvicorn main:app --reload --port 8000
```

Backend URLs:

- Health: `http://localhost:8000/healthz`
- Agent endpoint: `http://localhost:8000/ai/agent-chat`

### 2. Run Main Frontend (Traverse)

```bash
npm install
export NEXT_PUBLIC_API_BASE=http://localhost:8000
npm run dev
```

Main frontend URL: `http://localhost:3000` (or next available port)

## Environment Variables

Backend (`local-host-ai/backend`):

- `OPENAI_API_KEY`: Enables LLM-based extraction and response composition
- `ALLOWED_ORIGINS`: Comma-separated allowed frontend domains

Frontend:

- `NEXT_PUBLIC_API_BASE`: Backend base URL, for example `http://localhost:8000`

## Agentic Runtime (Traverse AI Agent)

The `/ai/agent-chat` endpoint now runs an agentic loop with:

- Planner stage: selects a tool plan (`HostMatchTool`, `ItineraryTool`, `SafetyTool`)
- Execution stage: runs tools only when requirements are satisfied
- Critic stage: scores output completeness and confidence before final response
- Persistent memory: session state stored in SQLite at `local-host-ai/backend/data/agent_memory.db`

Response now includes additional observability fields:

- `plan`
- `execution_trace`
- `critic_notes`
- `confidence`
- `stop_reason`

## University Submission Pack

The repository includes all required submission items:

1. GitHub repository link: this README (`https://github.com/nniikkyy/Traverse`)
2. Local run instructions: this README (section above)
3. Architecture diagram: `docs/architecture.md`
4. Sample API requests/responses: `docs/api-examples.md`
5. Demo + screenshots checklist: `docs/submission-evidence.md`

## Deployment Notes

### Backend (Render)

Use `render.yaml` or configure manually with:

- Root: `local-host-ai/backend`
- Build command: `pip install -r requirements.txt`
- Start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
- Health check path: `/healthz`

### Frontend (Vercel)

- Root directory: repository root
- Env var: `NEXT_PUBLIC_API_BASE=https://your-backend-url`

After frontend deploy, update backend `ALLOWED_ORIGINS` to the exact Vercel domain.
