from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes import auth, hosts, trips, messages, ai

app = FastAPI(title="Local Host AI Agent API", version="0.1.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(auth.router, prefix="/auth", tags=["auth"])
app.include_router(hosts.router, prefix="/hosts", tags=["hosts"])
app.include_router(trips.router, prefix="/trips", tags=["trips"])
app.include_router(messages.router, prefix="/messages", tags=["messages"])
app.include_router(ai.router, prefix="/ai", tags=["ai"])


@app.get("/")
def healthcheck():
    return {"status": "ok", "service": "local-host-ai"}
