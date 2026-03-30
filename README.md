# Traverse

Traverse is a host marketplace platform for India where tourists connect with local hosts and get AI-generated category-based plans.

## Stack

- Frontend: Next.js App Router + Tailwind
- Backend: FastAPI
- AI: OpenAI + tool orchestration (host match, itinerary, safety)

## Monorepo Layout

- `app/`, `components/`: Primary Next.js frontend
- `local-host-ai/backend/`: FastAPI API and AI orchestration
- `local-host-ai/frontend/`: Additional standalone Next.js frontend
- `render.yaml`: Render deployment config for backend API

## Local Development

### Frontend (root app)

```bash
npm install
npm run dev
```

### Backend API

```bash
cd local-host-ai/backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

## Environment Variables

Backend (`local-host-ai/backend`):

- `OPENAI_API_KEY`: required for full LLM-powered extraction/composition
- `ALLOWED_ORIGINS`: comma-separated frontend domains for CORS

Frontend:

- `NEXT_PUBLIC_API_BASE`: backend base URL (for example `https://your-api.onrender.com`)

## Deployment (Phase 2)

### 1. Deploy Backend on Render

1. In Render, create a new Blueprint or Web Service from this repository.
2. If using Blueprint, Render will use `render.yaml` automatically.
3. Set environment variables:
	- `OPENAI_API_KEY`
	- `ALLOWED_ORIGINS` (for example `https://traverse.vercel.app`)
4. Confirm service health check path: `/healthz`.

### 2. Deploy Frontend on Vercel

1. Import the same repository in Vercel.
2. Set root directory to repository root.
3. Add env var:
	- `NEXT_PUBLIC_API_BASE=https://your-render-backend-url`
4. Deploy.

### 3. Finalize CORS

After Vercel gives your domain, update Render `ALLOWED_ORIGINS` with that exact domain and redeploy backend.
