import json
import sqlite3
from pathlib import Path
from typing import Any

DB_PATH = Path(__file__).resolve().parent.parent / "data" / "agent_memory.db"


def _get_conn() -> sqlite3.Connection:
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)
    conn = sqlite3.connect(DB_PATH)
    conn.execute(
        """
        CREATE TABLE IF NOT EXISTS sessions (
            session_id TEXT PRIMARY KEY,
            payload TEXT NOT NULL,
            updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )
        """
    )
    return conn


def load_session(session_id: str) -> dict[str, Any]:
    with _get_conn() as conn:
        row = conn.execute(
            "SELECT payload FROM sessions WHERE session_id = ?", (session_id,)
        ).fetchone()
    if not row:
        return {"history": []}
    try:
        return json.loads(row[0])
    except (TypeError, json.JSONDecodeError):
        return {"history": []}


def save_session(session_id: str, payload: dict[str, Any]) -> None:
    serialized = json.dumps(payload)
    with _get_conn() as conn:
        conn.execute(
            """
            INSERT INTO sessions(session_id, payload, updated_at)
            VALUES (?, ?, CURRENT_TIMESTAMP)
            ON CONFLICT(session_id)
            DO UPDATE SET payload = excluded.payload, updated_at = CURRENT_TIMESTAMP
            """,
            (session_id, serialized),
        )
