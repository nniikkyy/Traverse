import Link from "next/link";

const pages = [
    { href: "/signup", label: "Sign up / Login" },
    { href: "/dashboard", label: "Dashboard" },
    { href: "/match", label: "Host Matching" },
    { href: "/chat", label: "AI Chat Assistant" },
    { href: "/itinerary", label: "AI Itinerary" }
];

export default function LandingPage() {
    return (
        <main className="min-h-screen bg-gradient-to-br from-cyan-50 to-slate-100 py-16">
            <section className="container-page">
                <h1 className="text-4xl font-black md:text-6xl">Local Host AI Agent</h1>
                <p className="mt-4 max-w-2xl text-lg text-slate-700">
                    Travel companion platform connecting travelers with local hosts and AI-powered trip planning.
                </p>

                <div className="mt-10 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {pages.map((page) => (
                        <Link key={page.href} href={page.href} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft transition hover:-translate-y-1">
                            <p className="text-lg font-semibold">{page.label}</p>
                            <p className="mt-1 text-sm text-slate-600">Open {page.href}</p>
                        </Link>
                    ))}
                </div>
            </section>
        </main>
    );
}
