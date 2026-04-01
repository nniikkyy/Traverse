import json
import os
import re
import uuid
from typing import Any

from openai import OpenAI

from services.db import HOSTS
from services.matching import match_host
from services.memory_store import load_session, save_session
from services.planner import generate_itinerary
from services.safety import detect_scam

CATEGORY_KEYWORDS = {
    "food": ["food", "street food", "eat", "restaurant", "cafe"],
    "culture": ["culture", "history", "heritage", "museum", "temple", "fort"],
    "nightlife": ["nightlife", "club", "bar", "party"],
    "nature": ["nature", "hike", "lake", "beach", "park", "sunset"],
    "shopping": ["shopping", "market", "bargain", "souvenir"],
    "events": ["event", "festival", "show", "concert"],
}

TOOL_REGISTRY: dict[str, dict[str, Any]] = {
    "HostMatchTool": {
        "description": "Find and score best matching local hosts.",
        "requires": ["city", "interests", "language"],
        "returns": ["host_candidates"],
    },
    "ItineraryTool": {
        "description": "Generate category-based itinerary days.",
        "requires": ["city", "interests", "budget"],
        "returns": ["itinerary_days"],
    },
    "SafetyTool": {
        "description": "Check potential overcharge/scam from quoted and average price.",
        "requires": ["quoted_price", "avg_price"],
        "returns": ["safety_flags"],
    },
}


def _normalize_text(value: str) -> str:
    return (value or "").strip().lower()


def _safe_json_parse(value: str) -> dict[str, Any]:
    try:
        return json.loads(value)
    except (json.JSONDecodeError, TypeError):
        return {}


def _extract_json_block(text: str) -> dict[str, Any]:
    if not text:
        return {}

    start = text.find("{")
    end = text.rfind("}")
    if start == -1 or end == -1 or end <= start:
        return {}

    return _safe_json_parse(text[start: end + 1])


def _extract_categories(message: str, interests: list[str] | None) -> list[str]:
    found = set()
    message_text = _normalize_text(message)

    for category, keywords in CATEGORY_KEYWORDS.items():
        if any(keyword in message_text for keyword in keywords):
            found.add(category)

    for interest in interests or []:
        interest_text = _normalize_text(interest)
        if not interest_text:
            continue

        matched_category = None
        for category, keywords in CATEGORY_KEYWORDS.items():
            if interest_text == category or interest_text in keywords:
                matched_category = category
                break
        found.add(matched_category or interest_text)

    return sorted(found)


def _extract_city(message: str, city: str | None) -> str | None:
    if city and city.strip():
        return city.strip()

    message_text = _normalize_text(message)
    for host in HOSTS:
        host_city = host["city"]
        if host_city.lower() in message_text:
            return host_city

    city_match = re.search(r"in\s+([A-Za-z\s]+)", message)
    if city_match:
        return city_match.group(1).strip().title()

    return None


def _infer_budget(text: str) -> str | None:
    message = _normalize_text(text)
    if not message:
        return None
    if any(token in message for token in ["cheap", "low", "budget", "backpack"]):
        return "low"
    if any(token in message for token in ["luxury", "premium", "high-end"]):
        return "high"
    if any(token in message for token in ["mid", "moderate", "standard"]):
        return "mid"
    return None


def _parse_itinerary_days(itinerary: dict[str, Any]) -> list[dict[str, Any]]:
    if "days" in itinerary and isinstance(itinerary["days"], list):
        return itinerary["days"]

    raw = itinerary.get("raw")
    if not raw or not isinstance(raw, str):
        return []

    lines = [line.strip("- ").strip()
             for line in raw.splitlines() if line.strip()]
    if not lines:
        return []

    chunks: list[dict[str, Any]] = []
    pointer = 0
    for day in range(1, 4):
        items = lines[pointer: pointer + 3]
        if not items:
            break
        chunks.append({"day": day, "items": items})
        pointer += 3
    return chunks


def _score_all_hosts(traveler: dict[str, Any]) -> list[dict[str, Any]]:
    scored_hosts: list[tuple[dict[str, Any], int]] = []

    for host in HOSTS:
        score = 0
        if traveler["city"].lower() == host["city"].lower():
            score += 40
        if set(traveler["interests"]) & set(host["interests"]):
            score += 30
        if traveler["language"] in host["languages"]:
            score += 20
        if host["rating"] > 4:
            score += 10
        if host.get("availability", False):
            score += 5

        scored_hosts.append((host, score))

    scored_hosts.sort(key=lambda item: item[1], reverse=True)

    results = []
    for host, score in scored_hosts[:3]:
        results.append(
            {
                "id": host["id"],
                "name": host["name"],
                "city": host["city"],
                "bio": host["bio"],
                "languages": host["languages"],
                "interests": host["interests"],
                "rating": host["rating"],
                "match_score": score,
            }
        )
    return results


def _infer_intent(message: str) -> str:
    text = _normalize_text(message)
    if any(token in text for token in ["scam", "safe", "price", "overcharge"]):
        return "safety_check"
    if any(token in text for token in ["itinerary", "plan", "day", "schedule"]):
        return "itinerary_planning"
    if any(token in text for token in ["host", "local", "guide", "match"]):
        return "host_matching"
    return "trip_assistant"


def _llm_extract_context(message: str, memory: dict[str, Any]) -> dict[str, Any]:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {}

    client = OpenAI(api_key=api_key)
    memory_city = memory.get("city", "")
    memory_interests = ", ".join(memory.get("interests", []))
    memory_budget = memory.get("budget", "")
    memory_language = memory.get("language", "")

    prompt = (
        "Extract travel assistant fields from user text and return STRICT JSON with keys: "
        "intent, city, interests, budget, language, quoted_price, avg_price. "
        "Use null if unknown. interests must be array of simple lowercase words. "
        f"Memory city: {memory_city}. Memory interests: {memory_interests}. "
        f"Memory budget: {memory_budget}. Memory language: {memory_language}. "
        f"User message: {message}"
    )

    try:
        result = client.chat.completions.create(
            model="gpt-5.3",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.2,
        )
        content = result.choices[0].message.content or ""
        parsed = _extract_json_block(content)
        if isinstance(parsed, dict):
            return parsed
    except Exception:
        return {}

    return {}


def _llm_compose_message(
    *,
    intent: str,
    city: str | None,
    missing: list[str],
    top_host: str | None,
    safety_flags: list[str],
    next_actions: list[str],
    critic_notes: list[str],
) -> str:
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        if missing:
            return f"I can continue once you share: {', '.join(missing)}."
        response = f"I matched hosts and generated a plan for {city}."
        if top_host:
            response += f" Best current match: {top_host}."
        if safety_flags:
            response += f" Safety warning: {safety_flags[0]}."
        return response

    client = OpenAI(api_key=api_key)
    prompt = (
        "Write a concise assistant reply in under 90 words for a travel host-matching AI. "
        f"Intent: {intent}. City: {city}. Missing fields: {missing}. "
        f"Top host: {top_host}. Safety flags: {safety_flags}. Next actions: {next_actions}. "
        f"Critic notes: {critic_notes}."
    )

    try:
        result = client.chat.completions.create(
            model="gpt-5.3",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5,
        )
        return (result.choices[0].message.content or "").strip()
    except Exception:
        return "I prepared host, itinerary, and safety outputs for your trip."


def _plan_tools(intent: str, state: dict[str, Any]) -> list[str]:
    plan: list[str] = []
    if intent in ["host_matching", "itinerary_planning", "trip_assistant"]:
        plan.extend(["HostMatchTool", "ItineraryTool"])
    if intent == "safety_check":
        plan.append("SafetyTool")

    quote_price = state.get("quoted_price")
    avg_price = state.get("avg_price")
    if quote_price is not None and avg_price is not None and "SafetyTool" not in plan:
        plan.append("SafetyTool")

    return plan


def _missing_requirements(tool_name: str, state: dict[str, Any]) -> list[str]:
    required = TOOL_REGISTRY[tool_name]["requires"]
    missing: list[str] = []
    for key in required:
        value = state.get(key)
        if value is None:
            missing.append(key)
        if isinstance(value, str) and not value.strip():
            missing.append(key)
        if isinstance(value, list) and not value:
            missing.append(key)
    return missing


def _run_tool(tool_name: str, state: dict[str, Any]) -> dict[str, Any]:
    if tool_name == "HostMatchTool":
        traveler = {
            "city": state["city"],
            "interests": state["interests"],
            "language": state["language"],
        }
        host_candidates = _score_all_hosts(traveler)
        best_host = match_host(traveler, HOSTS)
        return {
            "host_candidates": host_candidates,
            "best_host_id": best_host["id"] if best_host else None,
        }

    if tool_name == "ItineraryTool":
        itinerary = generate_itinerary(
            state["city"], state["interests"], state["budget"])
        return {"itinerary_days": _parse_itinerary_days(itinerary)}

    if tool_name == "SafetyTool":
        safety_message = detect_scam(state["quoted_price"], state["avg_price"])
        flags = []
        if safety_message != "Price looks fair":
            flags.append(safety_message)
        return {"safety_flags": flags}

    return {}


def _critic_assess(state: dict[str, Any], required_missing_fields: list[str]) -> tuple[list[str], float]:
    notes: list[str] = []
    confidence = 0.5

    if required_missing_fields:
        notes.append("Need missing fields before full execution.")
        confidence -= 0.25

    if state.get("host_candidates"):
        confidence += 0.2
    else:
        notes.append("No host candidates produced.")

    if state.get("itinerary_days"):
        confidence += 0.2
    elif not required_missing_fields:
        notes.append("Itinerary generation returned no day structure.")

    if state.get("safety_flags"):
        notes.append("Safety warning detected, advise caution.")

    return notes, max(0.0, min(1.0, confidence))


def run_agent(payload: dict[str, Any]) -> dict[str, Any]:
    session_id = payload.get("session_id") or str(uuid.uuid4())
    message = payload.get("message", "")

    memory = load_session(session_id)
    memory.setdefault("history", [])
    memory["history"].append({"role": "user", "content": message})

    llm_context = _llm_extract_context(message, memory)

    state: dict[str, Any] = {
        "city": payload.get("city") or llm_context.get("city") or memory.get("city") or _extract_city(message, None),
        "interests": _extract_categories(message, payload.get("interests")) or llm_context.get("interests") or memory.get("interests") or [],
        "budget": payload.get("budget") or llm_context.get("budget") or _infer_budget(message) or memory.get("budget") or "mid",
        "language": payload.get("language") or llm_context.get("language") or memory.get("language") or "English",
        "quoted_price": payload.get("quoted_price") if payload.get("quoted_price") is not None else llm_context.get("quoted_price"),
        "avg_price": payload.get("avg_price") if payload.get("avg_price") is not None else llm_context.get("avg_price"),
        "host_candidates": [],
        "itinerary_days": [],
        "safety_flags": [],
    }

    if state["city"]:
        memory["city"] = state["city"]
    if state["interests"]:
        memory["interests"] = state["interests"]
    if state["budget"]:
        memory["budget"] = state["budget"]
    if state["language"]:
        memory["language"] = state["language"]

    intent = llm_context.get("intent") or _infer_intent(message)

    required_missing_fields: list[str] = []
    if not state["city"]:
        required_missing_fields.append("city")
    if not state["interests"]:
        required_missing_fields.append("interests")

    plan = _plan_tools(intent, state)
    selected_tools: list[str] = []
    execution_trace: list[dict[str, Any]] = []
    stop_reason = "goal_completed"

    for index, tool_name in enumerate(plan, start=1):
        if index > 5:
            stop_reason = "max_steps_reached"
            break

        missing_for_tool = _missing_requirements(tool_name, state)
        if missing_for_tool:
            required_missing_fields = sorted(
                set(required_missing_fields + missing_for_tool))
            execution_trace.append(
                {
                    "step": index,
                    "action": tool_name,
                    "status": "skipped_missing_requirements",
                    "missing": missing_for_tool,
                    "requires": TOOL_REGISTRY[tool_name]["requires"],
                }
            )
            continue

        result = _run_tool(tool_name, state)
        selected_tools.append(tool_name)
        state.update(result)

        output_keys = [key for key in result.keys()]
        execution_trace.append(
            {
                "step": index,
                "action": tool_name,
                "status": "completed",
                "output_keys": output_keys,
                "description": TOOL_REGISTRY[tool_name]["description"],
            }
        )

    if required_missing_fields:
        stop_reason = "awaiting_user_input"

    critic_notes, confidence = _critic_assess(state, required_missing_fields)

    top_host = state["host_candidates"][0]["name"] if state["host_candidates"] else None

    if required_missing_fields:
        next_actions = [
            f"Please share your {', '.join(required_missing_fields)} to continue."]
    else:
        next_actions = [
            "Review top host suggestions.",
            "Pick one category route for Day 1.",
            "Confirm host request and budget range.",
        ]
        if state["safety_flags"]:
            next_actions.insert(
                0, "Double-check quoted prices before payment.")

    assistant_message = _llm_compose_message(
        intent=intent,
        city=state["city"],
        missing=required_missing_fields,
        top_host=top_host,
        safety_flags=state["safety_flags"],
        next_actions=next_actions,
        critic_notes=critic_notes,
    )

    memory["history"].append(
        {"role": "assistant", "content": assistant_message})
    memory["last_plan"] = plan
    memory["last_confidence"] = confidence
    save_session(session_id, memory)

    return {
        "session_id": session_id,
        "intent": intent,
        "required_missing_fields": required_missing_fields,
        "selected_tools": selected_tools,
        "host_candidates": state["host_candidates"],
        "itinerary_days": state["itinerary_days"],
        "safety_flags": state["safety_flags"],
        "next_actions": next_actions,
        "assistant_message": assistant_message,
        "plan": plan,
        "execution_trace": execution_trace,
        "critic_notes": critic_notes,
        "confidence": confidence,
        "stop_reason": stop_reason,
    }
