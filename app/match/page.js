"use client";

import HostCard from "../../components/HostCard";

const hosts = [
    { id: 1, name: "Aarav Singh", city: "Delhi", bio: "Food & history host", languages: ["English", "Hindi"], interests: ["food", "culture"], rating: 4.8 },
    { id: 2, name: "Mira Nair", city: "Goa", bio: "Beach & nightlife specialist", languages: ["English", "Hindi", "Konkani"], interests: ["nightlife", "food"], rating: 4.6 }
];

export default function MatchPage() {
    const requestHost = (id) => {
        alert(`Host request sent to host #${id}`);
    };

    return (
        <main className="min-h-screen bg-[#eef6fa] py-16 text-slate-900">
            <section className="container-page">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Host discovery</p>
                <h1 className="mt-2 text-4xl font-black">Find your local match</h1>
                <p className="mt-2 text-slate-600">These hosts are ranked by AI for city familiarity, language comfort, interests, and trust score.</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {hosts.map((host) => (
                        <HostCard key={host.id} host={host} onRequest={requestHost} />
                    ))}
                </div>
            </section>
        </main>
    );
}
