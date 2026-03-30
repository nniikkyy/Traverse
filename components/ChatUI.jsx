"use client";

import { useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";

export default function ChatUI() {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I can help you match with hosts and create category-based city plans." }
    ]);
    const [text, setText] = useState("");
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(false);

    const send = async () => {
        if (!text.trim()) return;
        const nextText = text.trim();
        setMessages((prev) => [...prev, { role: "user", content: nextText }]);
        setText("");

        try {
            setLoading(true);
            const response = await fetch(`${API_BASE}/ai/agent-chat`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    message: nextText,
                    session_id: sessionId
                })
            });

            if (!response.ok) {
                throw new Error("Agent request failed");
            }

            const result = await response.json();
            if (result.session_id) {
                setSessionId(result.session_id);
            }

            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: result.assistant_message || "I could not generate a response.",
                    analysis: result
                }
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "I could not reach the AI backend. Make sure FastAPI is running on port 8000."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
            <div className="h-72 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-4">
                {messages.map((msg, idx) => (
                    <div key={`${msg.role}-${idx}`} className="mb-3 text-sm">
                        <p className={msg.role === "user" ? "text-slate-900" : "text-teal-700"}>
                            <span className="font-semibold">{msg.role === "user" ? "You" : "AI"}:</span> {msg.content}
                        </p>

                        {msg.analysis ? (
                            <div className="mt-2 rounded-xl border border-teal-100 bg-white p-3 text-slate-700">
                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-700">
                                    Intent: {msg.analysis.intent}
                                </p>

                                {msg.analysis.selected_tools?.length ? (
                                    <div className="mt-2 flex flex-wrap gap-2">
                                        {msg.analysis.selected_tools.map((tool) => (
                                            <span key={tool} className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold text-slate-700">
                                                {tool}
                                            </span>
                                        ))}
                                    </div>
                                ) : null}

                                {msg.analysis.required_missing_fields?.length ? (
                                    <p className="mt-2 text-xs text-orange-700">
                                        Missing: {msg.analysis.required_missing_fields.join(", ")}
                                    </p>
                                ) : null}

                                {msg.analysis.host_candidates?.length ? (
                                    <div className="mt-3 grid gap-2">
                                        {msg.analysis.host_candidates.slice(0, 2).map((host) => (
                                            <article key={host.id} className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                                                <p className="font-semibold text-slate-900">{host.name} ({host.city})</p>
                                                <p className="text-xs">Score: {host.match_score} | Rating: {host.rating}</p>
                                            </article>
                                        ))}
                                    </div>
                                ) : null}

                                {msg.analysis.itinerary_days?.length ? (
                                    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-2">
                                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-600">Itinerary</p>
                                        {msg.analysis.itinerary_days.slice(0, 2).map((day) => (
                                            <p key={day.day} className="mt-1 text-xs text-slate-700">Day {day.day}: {(day.items || []).slice(0, 2).join(" | ")}</p>
                                        ))}
                                    </div>
                                ) : null}

                                {msg.analysis.safety_flags?.length ? (
                                    <p className="mt-2 text-xs font-semibold text-red-700">Safety: {msg.analysis.safety_flags.join(" | ")}</p>
                                ) : null}

                                {msg.analysis.next_actions?.length ? (
                                    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-2">
                                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-slate-600">Next Actions</p>
                                        <ul className="mt-1 list-disc pl-4 text-xs text-slate-700">
                                            {msg.analysis.next_actions.map((step) => (
                                                <li key={step}>{step}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}
                            </div>
                        ) : null}
                    </div>
                ))}
                {loading ? <p className="text-sm text-slate-500">AI is thinking...</p> : null}
            </div>
            <div className="mt-3 flex gap-2">
                <input
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    placeholder="Find me a student host for food spots in Delhi"
                    className="flex-1 rounded-xl border border-slate-300 px-3 py-3 text-sm"
                />
                <button onClick={send} disabled={loading} className="rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60">
                    Send
                </button>
            </div>
        </div>
    );
}
