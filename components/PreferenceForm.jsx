"use client";

import { useEffect, useState } from "react";

const PREFS_KEY = "traverse.preferences.v1";

export default function PreferenceForm() {
    const [form, setForm] = useState({
        city: "Delhi",
        budget: "25000",
        interests: "food, culture, local events",
        language: "English"
    });
    const [saved, setSaved] = useState(false);

    useEffect(() => {
        try {
            const raw = window.localStorage.getItem(PREFS_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw);
            setForm((prev) => ({ ...prev, ...parsed }));
        } catch {
            // Ignore malformed local preference payloads.
        }
    }, []);

    const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    const savePreferences = () => {
        window.localStorage.setItem(PREFS_KEY, JSON.stringify(form));
        window.dispatchEvent(new Event("traverse:prefs-updated"));
        setSaved(true);
        setTimeout(() => setSaved(false), 1800);
    };

    return (
        <form className="grid gap-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.1)] md:grid-cols-2">
            <label className="text-sm font-semibold text-slate-700">
                City
                <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" value={form.city} onChange={(e) => setField("city", e.target.value)} />
            </label>
            <label className="text-sm font-semibold text-slate-700">
                Budget (INR)
                <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" value={form.budget} onChange={(e) => setField("budget", e.target.value)} />
            </label>
            <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                Categories / Interests
                <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" value={form.interests} onChange={(e) => setField("interests", e.target.value)} />
            </label>
            <label className="text-sm font-semibold text-slate-700 md:col-span-2">
                Language
                <input className="mt-1 w-full rounded-xl border border-slate-300 px-3 py-3" value={form.language} onChange={(e) => setField("language", e.target.value)} />
            </label>
            <button type="button" onClick={savePreferences} className="rounded-xl bg-slate-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-slate-800 md:col-span-2">
                {saved ? "Preferences Saved" : "Save Preferences"}
            </button>
        </form>
    );
}
