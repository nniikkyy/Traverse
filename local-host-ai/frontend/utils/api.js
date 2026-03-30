const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export async function fetchHosts(city) {
    const res = await fetch(`${API_BASE}/hosts?city=${encodeURIComponent(city)}`);
    if (!res.ok) throw new Error("Failed to fetch hosts");
    return res.json();
}

export async function generateItinerary(payload) {
    const res = await fetch(`${API_BASE}/ai/itinerary`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to generate itinerary");
    return res.json();
}

export async function agentChat(payload) {
    const res = await fetch(`${API_BASE}/ai/agent-chat`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
    });
    if (!res.ok) throw new Error("Failed to get agent response");
    return res.json();
}
