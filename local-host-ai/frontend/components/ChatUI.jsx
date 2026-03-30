"use client";

import { useState } from "react";
import { agentChat } from "../utils/api";

export default function ChatUI() {
    const [messages, setMessages] = useState([
        { role: "assistant", content: "Hi! I can match hosts and create category-based AI plans." }
    ]);
    const [text, setText] = useState("");
    const [sessionId, setSessionId] = useState(null);
    const [loading, setLoading] = useState(false);

    const send = async () => {
        if (!text.trim()) return;
        const prompt = text.trim();
        setMessages((prev) => [...prev, { role: "user", content: prompt }]);
        setText("");

        try {
            setLoading(true);
            const result = await agentChat({ message: prompt, session_id: sessionId });
            if (result.session_id) {
                setSessionId(result.session_id);
            }
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: result.assistant_message,
                    meta: result
                }
            ]);
        } catch (error) {
            setMessages((prev) => [
                ...prev,
                {
                    role: "assistant",
                    content: "Could not reach AI backend. Please start FastAPI on port 8000."
                }
            ]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-soft">
            <div className="h-72 overflow-y-auto rounded-lg border border-slate-100 bg-slate-50 p-3">
                {messages.map((msg, idx) => (
                    <div key={`${msg.role}-${idx}`} className="mb-2 text-sm">
                        <p className={msg.role === "user" ? "text-slate-900" : "text-teal-700"}>
                            <span className="font-semibold">{msg.role === "user" ? "You" : "AI"}:</span> {msg.content}
                        </p>
                        {msg.meta ? (
                            <div className="mt-1 space-y-1 text-xs text-slate-600">
                                <p>Tools: {(msg.meta.selected_tools || []).join(", ") || "None"}</p>
                                {msg.meta.required_missing_fields?.length ? (
                                    <p className="text-orange-700">Missing: {msg.meta.required_missing_fields.join(", ")}</p>
                                ) : null}
                                {msg.meta.next_actions?.length ? (
                                    <ul className="list-disc pl-4 text-slate-700">
                                        {msg.meta.next_actions.map((step) => (
                                            <li key={step}>{step}</li>
                                        ))}
                                    </ul>
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
                    placeholder="Find me a host for culture walks in Delhi"
                    className="flex-1 rounded-lg border border-slate-300 px-3 py-2 text-sm"
                />
                <button onClick={send} disabled={loading} className="rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:opacity-60">
                    Send
                </button>
            </div>
        </div>
    );
}
