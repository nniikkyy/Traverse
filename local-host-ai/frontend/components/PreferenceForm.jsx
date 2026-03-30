"use client";

import { useState } from "react";

export default function PreferenceForm() {
    const [form, setForm] = useState({
        city: "Delhi",
        budget: "25000",
        interests: "food, culture",
        language: "English"
    });

    const setField = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

    return (
        <form className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-5 shadow-soft md:grid-cols-2">
            <label className="text-sm font-medium">
                City
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={form.city} onChange={(e) => setField("city", e.target.value)} />
            </label>
            <label className="text-sm font-medium">
                Budget
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={form.budget} onChange={(e) => setField("budget", e.target.value)} />
            </label>
            <label className="text-sm font-medium md:col-span-2">
                Interests
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={form.interests} onChange={(e) => setField("interests", e.target.value)} />
            </label>
            <label className="text-sm font-medium md:col-span-2">
                Language
                <input className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" value={form.language} onChange={(e) => setField("language", e.target.value)} />
            </label>
            <button type="button" className="rounded-lg bg-teal-700 px-4 py-2 text-sm font-semibold text-white md:col-span-2">
                Save Preferences
            </button>
        </form>
    );
}
