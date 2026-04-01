"use client";

import { useEffect, useState } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE || "http://localhost:8000";
const PREFS_KEY = "traverse.preferences.v1";

function buildPromptTemplates(prefs) {
    const city = prefs?.city || "Delhi";
    const language = prefs?.language || "English";
    const interests = prefs?.interests || "food, culture";

    return [
        `Find me top host options in ${city} for ${interests}.`,
        `Create a 3-day ${city} itinerary focused on ${interests}.`,
        `I got quoted 1800 in ${city}. Is this fair and what should I ask in ${language}?`
    ];
}

function traceStatusStyles(status) {
    if (status === "completed") {
        return "border-emerald-200 bg-emerald-50 text-emerald-800";
    }
    if (status === "skipped_missing_requirements") {
        return "border-amber-200 bg-amber-50 text-amber-800";
    }
    return "border-slate-200 bg-slate-50 text-slate-700";
}

function buildRetryPrompt(analysis, prefs) {
    const missing = analysis?.required_missing_fields || [];
    const baseCity = prefs?.city || "Delhi";
    const baseInterests = prefs?.interests || "food, culture";
    const baseBudget = prefs?.budget || "mid";

    if (missing.length) {
        return `Retrying with details: city ${baseCity}, interests ${baseInterests}, budget ${baseBudget}. Please continue with host match and itinerary.`;
    }

    return `Retry and improve quality with concrete options, estimated costs, and a safer action plan for ${baseCity} focused on ${baseInterests}.`;
}

export default function ChatUI() {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I can help you match with hosts and create category-based city plans." }
    ]);
    const [text, setText] = useState("");
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [prefs, setPrefs] = useState(null);

    useEffect(() => {
        const loadPrefs = () => {
            try {
                const raw = window.localStorage.getItem(PREFS_KEY);
                setPrefs(raw ? JSON.parse(raw) : null);
            } catch {
                setPrefs(null);
            }
        };

        loadPrefs();
        window.addEventListener("storage", loadPrefs);
        window.addEventListener("traverse:prefs-updated", loadPrefs);
        return () => {
            window.removeEventListener("storage", loadPrefs);
            window.removeEventListener("traverse:prefs-updated", loadPrefs);
        };
    }, []);

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
                    session_id: sessionId,
                    city: prefs?.city || undefined,
                    budget: prefs?.budget || undefined,
                    language: prefs?.language || undefined,
                    interests: prefs?.interests ? prefs.interests.split(",").map((x) => x.trim()).filter(Boolean) : undefined
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

    const quickPrompts = buildPromptTemplates(prefs);
    const getRunLabel = (index) => {
        const completed = messages
            .slice(0, index + 1)
            .filter((item) => item.role === "assistant" && item.analysis).length;
        return `Agent Run #${completed}`;
    };

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
            {prefs ? (
                <div className="mb-3 rounded-xl border border-cyan-100 bg-cyan-50 p-3 text-xs text-cyan-900">
                    <p className="font-bold uppercase tracking-[0.12em]">Active Traveler Context</p>
                    <p className="mt-1">{prefs.city} • {prefs.budget} INR • {prefs.language} • {prefs.interests}</p>
                </div>
            ) : null}
            <div className="mb-3">
                <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-600">Quick Prompts</p>
                <div className="mt-2 flex flex-wrap gap-2">
                    {quickPrompts.map((prompt) => (
                        <button
                            key={prompt}
                            type="button"
                            onClick={() => setText(prompt)}
                            className="rounded-full border border-slate-200 bg-slate-50 px-3 py-1 text-xs font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50"
                        >
                            {prompt}
                        </button>
                    ))}
                </div>
            </div>
            <div className="h-72 overflow-y-auto rounded-xl border border-slate-100 bg-slate-50 p-4">
                {messages.map((msg, idx) => (
                    <div key={`${msg.role}-${idx}`} className="mb-3 text-sm">
                        <p className={msg.role === "user" ? "text-slate-900" : "text-teal-700"}>
                            <span className="font-semibold">{msg.role === "user" ? "You" : "AI"}:</span> {msg.content}
                        </p>

                        {msg.analysis ? (
                            <div className="mt-2 rounded-xl border border-teal-100 bg-white p-3 text-slate-700">
                                <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-slate-500">
                                    {getRunLabel(idx)}
                                </p>
                                <p className="text-xs font-bold uppercase tracking-[0.12em] text-teal-700">
                                    Intent: {msg.analysis.intent}
                                </p>
                                <div className="mt-2 flex flex-wrap gap-2 text-[11px]">
                                    {typeof msg.analysis.confidence === "number" ? (
                                        <span className={`rounded-full px-2 py-1 font-semibold ${msg.analysis.confidence >= 0.7 ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
                                            Confidence: {Math.round(msg.analysis.confidence * 100)}%
                                        </span>
                                    ) : null}
                                    {msg.analysis.stop_reason ? (
                                        <span className="rounded-full bg-slate-100 px-2 py-1 font-semibold text-slate-700">
                                            Stop: {msg.analysis.stop_reason}
                                        </span>
                                    ) : null}
                                </div>

                                {msg.analysis.plan?.length ? (
                                    <div className="mt-2">
                                        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-slate-600">Agent Plan</p>
                                        <div className="mt-1 flex flex-wrap gap-2">
                                            {msg.analysis.plan.map((step) => (
                                                <span key={step} className="rounded-full border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700">
                                                    {step}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                ) : null}

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
                                    <div className="mt-2 rounded-lg border border-orange-100 bg-orange-50 p-2">
                                        <p className="text-xs text-orange-700">
                                            Missing: {msg.analysis.required_missing_fields.join(", ")}
                                        </p>
                                        <div className="mt-2 flex flex-wrap gap-2">
                                            {msg.analysis.required_missing_fields.map((field) => (
                                                <button
                                                    key={field}
                                                    type="button"
                                                    onClick={() => setText((prev) => `${prev} My ${field} is `)}
                                                    className="rounded-full border border-orange-200 bg-white px-2 py-1 text-[11px] font-semibold text-orange-700"
                                                >
                                                    Add {field}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
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

                                {msg.analysis.execution_trace?.length ? (
                                    <div className="mt-3 rounded-lg border border-slate-200 bg-slate-50 p-2">
                                        <details>
                                            <summary className="cursor-pointer text-xs font-bold uppercase tracking-[0.1em] text-slate-600">
                                                Agent Timeline
                                            </summary>
                                            <ul className="mt-2 space-y-2 text-xs">
                                                {msg.analysis.execution_trace.map((row) => (
                                                    <li key={`${row.step}-${row.action}`} className={`rounded-md border px-2 py-1 ${traceStatusStyles(row.status)}`}>
                                                        <p className="font-semibold">Step {row.step}: {row.action}</p>
                                                        <p className="text-[11px]">Status: {row.status}</p>
                                                        {row.missing?.length ? <p className="text-[11px]">Needs: {row.missing.join(", ")}</p> : null}
                                                    </li>
                                                ))}
                                            </ul>
                                        </details>
                                    </div>
                                ) : null}

                                {msg.analysis.critic_notes?.length ? (
                                    <div className="mt-3 rounded-lg border border-amber-100 bg-amber-50 p-2">
                                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-amber-700">Critic Notes</p>
                                        <ul className="mt-1 list-disc pl-4 text-xs text-amber-800">
                                            {msg.analysis.critic_notes.map((note) => (
                                                <li key={note}>{note}</li>
                                            ))}
                                        </ul>
                                    </div>
                                ) : null}

                                {typeof msg.analysis.confidence === "number" && msg.analysis.confidence < 0.5 ? (
                                    <div className="mt-3 rounded-lg border border-sky-100 bg-sky-50 p-2">
                                        <p className="text-xs font-bold uppercase tracking-[0.1em] text-sky-700">Improve Result Quality</p>
                                        <p className="mt-1 text-xs text-sky-800">Provide one more concrete detail like city, exact interests, budget range, or quoted price.</p>
                                        <button
                                            type="button"
                                            onClick={() => setText(buildRetryPrompt(msg.analysis, prefs))}
                                            className="mt-2 rounded-full border border-sky-200 bg-white px-3 py-1 text-[11px] font-semibold text-sky-800"
                                        >
                                            Retry With Better Prompt
                                        </button>
                                    </div>
                                ) : null}

                                {typeof msg.analysis.confidence === "number" && msg.analysis.confidence >= 0.5 ? (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        <button
                                            type="button"
                                            onClick={() => setText(buildRetryPrompt(msg.analysis, prefs))}
                                            className="rounded-full border border-teal-200 bg-teal-50 px-3 py-1 text-[11px] font-semibold text-teal-800"
                                        >
                                            Refine This Run
                                        </button>
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
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !loading) {
                            e.preventDefault();
                            send();
                        }
                    }}
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
