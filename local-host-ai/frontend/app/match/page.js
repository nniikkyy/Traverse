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
        <main className="min-h-screen bg-slate-100 py-16">
            <section className="container-page">
                <h1 className="text-3xl font-bold">Host Matching</h1>
                <p className="mt-2 text-slate-600">AI-ranked hosts based on city, language, rating, and interests.</p>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {hosts.map((host) => (
                        <HostCard key={host.id} host={host} onRequest={requestHost} />
                    ))}
                </div>
            </section>
        </main>
    );
}
