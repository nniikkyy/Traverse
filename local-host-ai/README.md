# Local Host AI Agent

AI-powered travel companion platform focused on matching travelers with local hosts, generating itineraries, and assisting with real-time safety and chat support.

## Architecture

Frontend (Next.js App Router) -> Backend API (FastAPI) -> AI Layer (OpenAI + custom logic) -> Database (PostgreSQL/Firebase-ready) -> External APIs (Maps, Payments)

## Project Structure

- `frontend/`: Next.js app with user-facing pages and reusable components
- `backend/`: FastAPI app with routes, schemas, and services
- `ai/`: Standalone AI logic examples for matching/planner/safety
- `database/`: SQL schema for PostgreSQL
- `.env`: Environment variables

## Frontend Routes

- `/` Landing page
- `/signup`
- `/dashboard`
- `/match`
- `/chat`
- `/itinerary`

## Backend API Endpoints

- `GET /` healthcheck
- `POST /auth/signup`
- `GET /hosts`
- `POST /trips`
- `GET /trips`
- `POST /messages`
- `GET /messages`
- `POST /ai/match`
- `POST /ai/itinerary`
- `POST /ai/safety`

## Run Locally

### 1. Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on `http://localhost:3000` by default.

### 2. Backend

```bash
cd backend
python -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

Backend runs on `http://localhost:8000`.

## Database Setup

Run SQL in `database/schema.sql` on PostgreSQL.

## Notes

- If `OPENAI_API_KEY` is missing, itinerary generation returns fallback content.
- Firebase/Auth and Razorpay are placeholders ready for integration.
