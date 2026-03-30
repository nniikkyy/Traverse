"use client";

import { useState } from "react";

const DESTINATIONS = ["Goa", "Manali", "Jaipur", "Kerala", "Ladakh"];

export default function Hero() {
    const [destination, setDestination] = useState(DESTINATIONS[0]);

    return (
        <section className="relative min-h-[92vh] overflow-hidden text-white">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "linear-gradient(180deg, rgba(2,9,18,0.52), rgba(2,8,16,0.86)), url('https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=2200&q=80')"
                }}
            />

            <div className="relative section-wrap flex min-h-[92vh] flex-col justify-center pt-24">
                <p className="w-fit rounded-full border border-white/40 bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.24em] text-cyan-100">
                    India Only Journeys
                </p>

                <h1 className="mt-6 max-w-4xl text-5xl font-black leading-[1.02] md:text-7xl">
                    Discover Incredible India
                </h1>

                <p className="mt-5 max-w-2xl text-lg text-slate-100 md:text-2xl">
                    Authentic travel experiences across India
                </p>

                <div className="mt-10 flex w-full max-w-3xl flex-col gap-3 rounded-2xl border border-white/30 bg-black/30 p-4 backdrop-blur-xl md:flex-row md:items-end">
                    <label className="flex-1 text-sm font-medium">
                        Select Destination
                        <select
                            value={destination}
                            onChange={(e) => setDestination(e.target.value)}
                            className="mt-2 w-full rounded-xl border border-white/40 bg-white px-3 py-3 text-slate-900 outline-none"
                        >
                            {DESTINATIONS.map((item) => (
                                <option key={item} value={item}>
                                    {item}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button className="rounded-xl bg-orange-500 px-7 py-3 font-bold transition hover:bg-orange-600">
                        Search
                    </button>
                </div>
            </div>
        </section>
    );
}
