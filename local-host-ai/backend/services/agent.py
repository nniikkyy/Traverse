import json
import os
import re
import uuid
from typing import Any

from openai import OpenAI

from services.db import AGENT_MEMORY, HOSTS
from services.matching import match_host
from services.planner import generate_itinerary
from services.safety import detect_scam

CATEGORY_KEYWORDS = {
    "food": ["food", "street food", "eat", "restaurant", "cafe"],
    "culture": ["culture", "history", "heritage", "museum", "temple", "fort"],
    "nightlife": ["nightlife", "club", "bar", "party"],
    "nature": ["nature", "hike", "lake", "beach", "park", "sunset"],
    "shopping": ["shopping", "market", "bargain", "souvenir"],
    "events": ["event", "festival", "show", "concert"]
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

    return _safe_json_parse(text[start:end + 1])


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

    lines = [line.strip("- ").strip() for line in raw.splitlines() if line.strip()]
    if not lines:
        return []

    chunks: list[dict[str, Any]] = []
    pointer = 0
    for day in range(1, 4):
        items = lines[pointer:pointer + 3]
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
                "match_score": score
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
            temperature=0.2
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
    next_actions: list[str]
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
        "Write a concise assistant reply in under 75 words for a travel host-matching AI. "
        f"Intent: {intent}. City: {city}. Missing fields: {missing}. "
        f"Top host: {top_host}. Safety flags: {safety_flags}. Next actions: {next_actions}."
    )

    try:
        result = client.chat.completions.create(
            model="gpt-5.3",
            messages=[{"role": "user", "content": prompt}],
            temperature=0.5
        )
        return (result.choices[0].message.content or "").strip()
    except Exception:
        return "I prepared your host and itinerary options."


def run_agent(payload: dict[str, Any]) -> dict[str, Any]:
    session_id = payload.get("session_id") or str(uuid.uuid4())
    message = payload.get("message", "")

    memory = AGENT_MEMORY.get(session_id, {"history": []})
    memory["history"].append({"role": "user", "content": message})

    llm_context = _llm_extract_context(message, memory)

    city = (
        payload.get("city")
        or llm_context.get("city")
        or memory.get("city")
        or _extract_city(message, None)
    )
    categories = (
        _extract_categories(message, payload.get("interests"))
        or llm_context.get("interests")
        or memory.get("interests")
        or []
    )
    budget = (
        payload.get("budget")
        or llm_context.get("budget")
        or _infer_budget(message)
        or memory.get("budget")
        or "mid"
    )
    language = (
        payload.get("language")
        or llm_context.get("language")
        or memory.get("language")
        or "English"
    )

    if city:
        memory["city"] = city
    if categories:
        memory["interests"] = categories
    if budget:
        memory["budget"] = budget
    if language:
        memory["language"] = language

    intent = llm_context.get("intent") or _infer_intent(message)
    selected_tools: list[str] = []
    required_missing_fields: list[str] = []
    host_candidates: list[dict[str, Any]] = []
    itinerary_days: list[dict[str, Any]] = []
    safety_flags: list[str] = []

    if not city:
        required_missing_fields.append("city")
    if not categories:
        required_missing_fields.append("interests")

    should_match_hosts = intent in ["host_matching", "trip_assistant", "itinerary_planning"]
    should_plan_trip = intent in ["itinerary_planning", "trip_assistant", "host_matching"]

    if not required_missing_fields and should_match_hosts:
        traveler = {
            "city": city,
            "interests": categories,
            "language": language
        }

        selected_tools.append("HostMatchTool")
        best_host = match_host(traveler, HOSTS)
        host_candidates = _score_all_hosts(traveler)
        if best_host:
            memory["last_host_id"] = best_host["id"]

    if not required_missing_fields and should_plan_trip:
        selected_tools.append("ItineraryTool")
        itinerary = generate_itinerary(city, categories, budget)
        itinerary_days = _parse_itinerary_days(itinerary)

    quote_price = payload.get("quoted_price")
    avg_price = payload.get("avg_price")
    if quote_price is None:
        quote_price = llm_context.get("quoted_price")
    if avg_price is None:
        avg_price = llm_context.get("avg_price")

    if quote_price is not None and avg_price is not None:
        selected_tools.append("SafetyTool")
        safety_message = detect_scam(quote_price, avg_price)
        if safety_message != "Price looks fair":
            safety_flags.append(safety_message)

    top_host = host_candidates[0]["name"] if host_candidates else None

    if required_missing_fields:
        next_actions = [
            f"Please share your {', '.join(required_missing_fields)} to continue."]
        assistant_message = _llm_compose_message(
            intent=intent,
            city=city,
            missing=required_missing_fields,
            top_host=top_host,
            safety_flags=safety_flags,
            next_actions=next_actions
        )
    else:
        next_actions = [
            "Review top host suggestions.",
            "Pick one category route for Day 1.",
            "Confirm host request and budget range."
        ]
        if safety_flags:
            next_actions.insert(0, "Double-check quoted prices before payment.")
        assistant_message = _llm_compose_message(
            intent=intent,
            city=city,
            missing=required_missing_fields,
            top_host=top_host,
            safety_flags=safety_flags,
            next_actions=next_actions
        )

    memory["history"].append(
        {"role": "assistant", "content": assistant_message})
    AGENT_MEMORY[session_id] = memory

    return {
        "session_id": session_id,
        "intent": intent,
        "required_missing_fields": required_missing_fields,
        "selected_tools": selected_tools,
        "host_candidates": host_candidates,
        "itinerary_days": itinerary_days,
        "safety_flags": safety_flags,
        "next_actions": next_actions,
        "assistant_message": assistant_message
    }
