import Link from "next/link";

const categoryTracks = [
    {
        title: "Food Streets",
        icon: "\ud83c\udf5c",
        desc: "Find local hosts for market crawls, cafe hops, and late-night local gems.",
        tag: "Budget friendly"
    },
    {
        title: "Culture Walks",
        icon: "\ud83c\udfdb\ufe0f",
        desc: "Temples, forts, stories, and neighborhoods explained by people who grew up there.",
        tag: "History first"
    },
    {
        title: "College Vibes",
        icon: "\ud83c\udf93",
        desc: "Student hosts show social spots, co-working cafes, and youth events.",
        tag: "Social"
    },
    {
        title: "Nature Escapes",
        icon: "\ud83c\udfde\ufe0f",
        desc: "Weekend routes for lakes, hills, beaches, and viewpoints around your city.",
        tag: "Relaxed pace"
    }
];

const hostPerks = [
    "Any trusted local can become a host",
    "Students can host part-time and earn",
    "AI helps match vibe, language, and pace",
    "Tourists receive category-based day plans"
];

const flowLinks = [
    { href: "/signup", label: "Join as Host or Tourist" },
    { href: "/dashboard", label: "Set Preferences" },
    { href: "/match", label: "Find Local Hosts" },
    { href: "/chat", label: "Chat with AI Co-pilot" },
    { href: "/itinerary", label: "Generate Day Plans" }
];

const heroStats = [
    { value: "120+", label: "Active city hosts" },
    { value: "4.8/5", label: "Average host trust score" },
    { value: "6", label: "AI planning categories" }
];

const footerColumns = [
    {
        title: "Product",
        links: ["How it works", "AI categories", "Host matching", "Safety layer"]
    },
    {
        title: "Community",
        links: ["Become a host", "Host guidelines", "Traveler trust tips", "City standards"]
    },
    {
        title: "Company",
        links: ["About Traverse", "Privacy", "Terms", "Contact"]
    }
];

const howSteps = [
    {
        title: "Create a profile",
        desc: "Join as tourist or local host with language, vibe, and city context."
    },
    {
        title: "Set your categories",
        desc: "Pick what matters: food, culture, nightlife, nature, shopping, or local events."
    },
    {
        title: "AI matches people",
        desc: "Traverse ranks hosts by compatibility score, trust rating, and availability."
    },
    {
        title: "Explore with confidence",
        desc: "Receive a day-by-day plan and coordinate in-app with your selected host."
    }
];

const hostTrustSignals = [
    "Profile verification + city familiarity checks",
    "Community ratings after each hosted experience",
    "Category-level expertise tags per host",
    "AI moderation for suspicious chat and requests"
];

export default function HomePage() {
    return (
        <main className="text-slate-100">
            <section className="relative overflow-hidden border-b border-white/10 bg-[#0a1324]">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_25%,rgba(45,212,191,0.25),transparent_38%),radial-gradient(circle_at_85%_0%,rgba(34,211,238,0.24),transparent_36%),radial-gradient(circle_at_70%_82%,rgba(251,146,60,0.2),transparent_40%)]" />
                <div className="absolute -left-16 top-24 h-56 w-56 rounded-full border border-white/15 bg-white/5 blur-2xl animate-slow-float" />
                <div className="absolute -right-20 bottom-8 h-72 w-72 rounded-full border border-cyan-200/15 bg-cyan-200/10 blur-2xl animate-slow-float [animation-delay:900ms]" />
                <div className="container-page relative z-10 py-8 md:py-10">
                    <header className="motion-fade-up flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/15 bg-white/5 px-4 py-3 backdrop-blur-md md:px-6" style={{ "--delay": "80ms" }}>
                        <p className="text-xl font-black tracking-tight text-white md:text-2xl">Traverse</p>
                        <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold">
                            <a href="#how" className="rounded-full border border-white/20 px-4 py-2 transition hover:-translate-y-0.5 hover:bg-white/10">How it works</a>
                            <a href="#categories" className="rounded-full border border-white/20 px-4 py-2 transition hover:-translate-y-0.5 hover:bg-white/10">AI Categories</a>
                            <a href="#host" className="rounded-full border border-white/20 px-4 py-2 transition hover:-translate-y-0.5 hover:bg-white/10">Become host</a>
                            <Link href="/signup" className="cta-glow rounded-full bg-white px-5 py-2 text-slate-900 transition hover:-translate-y-0.5 hover:bg-slate-200">Start now</Link>
                        </nav>
                    </header>

                    <div className="grid gap-8 pb-14 pt-12 md:grid-cols-[1.2fr_0.8fr] md:items-end md:pb-20">
                        <div className="motion-fade-up" style={{ "--delay": "160ms" }}>
                            <p className="inline-flex rounded-full border border-teal-200/40 bg-teal-300/10 px-4 py-1 text-xs font-extrabold uppercase tracking-[0.2em] text-teal-200">
                                Host community platform
                            </p>
                            <h1 className="mt-6 max-w-3xl text-4xl font-black leading-tight text-white md:text-6xl">
                                Not a travel agency. A people-powered India exploration network.
                            </h1>
                            <p className="mt-5 max-w-2xl text-base text-slate-200 md:text-lg">
                                Tourists connect with verified locals, including students and long-time residents, then AI builds day plans by category like food, culture, nightlife, and nature.
                            </p>

                            <div className="mt-8 flex flex-wrap gap-3">
                                <Link href="/signup" className="motion-card rounded-xl bg-teal-400 px-6 py-3 text-sm font-extrabold text-slate-900 transition hover:bg-teal-300">
                                    I want to host
                                </Link>
                                <Link href="/dashboard" className="motion-card rounded-xl border border-white/25 bg-white/10 px-6 py-3 text-sm font-extrabold text-white transition hover:bg-white/15">
                                    I am traveling
                                </Link>
                            </div>

                            <div className="mt-8 grid gap-3 sm:grid-cols-3">
                                {heroStats.map((item, idx) => (
                                    <article key={item.label} className="motion-card motion-fade-up rounded-xl border border-white/20 bg-white/10 p-4 backdrop-blur-sm" style={{ "--delay": `${240 + idx * 90}ms` }}>
                                        <p className="text-2xl font-black text-white">{item.value}</p>
                                        <p className="mt-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-200">{item.label}</p>
                                    </article>
                                ))}
                            </div>
                        </div>

                        <div className="motion-fade-up rounded-3xl border border-white/20 bg-gradient-to-b from-white/14 to-white/6 p-6 backdrop-blur-xl" style={{ "--delay": "260ms" }}>
                            <p className="text-sm font-bold uppercase tracking-[0.16em] text-teal-100">Why this works</p>
                            <ul className="mt-4 space-y-3 text-sm text-slate-100">
                                {hostPerks.map((perk) => (
                                    <li key={perk} className="flex gap-3">
                                        <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-teal-300" />
                                        <span>{perk}</span>
                                    </li>
                                ))}
                            </ul>

                            <div className="mt-6 rounded-2xl border border-white/20 bg-slate-900/35 p-4">
                                <p className="text-xs font-bold uppercase tracking-[0.16em] text-cyan-100">Live AI flow</p>
                                <p className="mt-2 text-sm text-slate-200">Category picked: Culture Walks</p>
                                <p className="mt-1 text-sm text-slate-200">Best host match: Delhi history student</p>
                                <p className="mt-1 text-sm text-slate-200">Plan generated: 3-day heritage + food route</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section id="categories" className="relative border-b border-slate-200 bg-[#f3f8fa] py-20 text-slate-900">
                <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-cyan-100/40 to-transparent" />
                <div className="container-page">
                    <div className="motion-fade-up flex flex-wrap items-end justify-between gap-4" style={{ "--delay": "90ms" }}>
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">AI Planning</p>
                            <h2 className="mt-2 text-3xl font-black md:text-5xl">Plan by category, not generic packages</h2>
                            <p className="mt-3 max-w-2xl text-sm text-slate-600 md:text-base">
                                Each track blends host knowledge with AI routing so tourists get plans that feel local, human, and actually practical.
                            </p>
                        </div>
                        <Link href="/itinerary" className="rounded-full border border-teal-300 bg-teal-50 px-5 py-2 text-sm font-bold text-teal-800 transition hover:bg-teal-100">
                            Generate my plan
                        </Link>
                    </div>

                    <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
                        {categoryTracks.map((cat, idx) => (
                            <article
                                key={cat.title}
                                className={`motion-card motion-fade-up rounded-3xl border p-5 shadow-[0_18px_50px_rgba(15,23,42,0.08)] ${idx % 2 === 0 ? "border-teal-100 bg-white" : "border-cyan-100 bg-[#f8fdff]"}`}
                                style={{ "--delay": `${140 + idx * 90}ms` }}
                            >
                                <p className="text-3xl">{cat.icon}</p>
                                <h3 className="mt-4 text-xl font-extrabold">{cat.title}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-slate-600">{cat.desc}</p>
                                <div className="mt-4 flex items-center justify-between gap-2">
                                    <p className="inline-block rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-700">{cat.tag}</p>
                                    <p className="text-xs font-bold uppercase tracking-[0.14em] text-teal-700">AI + host</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </div>
            </section>

            <section id="how" className="border-b border-slate-200 bg-white py-20 text-slate-900">
                <div className="container-page grid gap-10 md:grid-cols-[0.95fr_1.05fr]">
                    <div className="motion-fade-up" style={{ "--delay": "80ms" }}>
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-orange-600">How it works</p>
                        <h2 className="mt-2 text-3xl font-black md:text-5xl">From profile to local host in minutes</h2>
                        <p className="mt-4 text-sm leading-relaxed text-slate-600 md:text-base">
                            The flow is designed for speed: short inputs, clear matching, transparent trust signals, and ready-to-use day plans.
                        </p>

                        <div className="mt-6 rounded-2xl border border-orange-100 bg-orange-50/70 p-5">
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-orange-700">Speed benchmark</p>
                            <p className="mt-2 text-2xl font-black text-slate-900">Under 4 minutes</p>
                            <p className="mt-1 text-sm text-slate-600">Typical time from signup to first host recommendation.</p>
                        </div>
                    </div>
                    <ol className="space-y-4">
                        {howSteps.map((step, index) => (
                            <li key={step.title} className="motion-fade-up motion-card group relative rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700 transition hover:border-slate-300 hover:bg-slate-100" style={{ "--delay": `${130 + index * 95}ms` }}>
                                <span className="mr-3 inline-flex h-7 w-7 items-center justify-center rounded-full bg-slate-900 text-xs font-extrabold text-white">
                                    {index + 1}
                                </span>
                                <span className="text-base font-extrabold text-slate-900">{step.title}</span>
                                <p className="mt-2 pl-10 text-sm text-slate-600">{step.desc}</p>

                                {index < howSteps.length - 1 ? (
                                    <span className="absolute left-[18px] top-[58px] hidden h-8 w-px bg-slate-300 md:block" />
                                ) : null}
                            </li>
                        ))}
                    </ol>
                </div>
            </section>

            <section id="host" className="relative border-b border-slate-800 bg-[#111827] py-20 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_0%,rgba(56,189,248,0.14),transparent_34%),radial-gradient(circle_at_90%_80%,rgba(45,212,191,0.12),transparent_36%)]" />
                <div className="container-page relative z-10 grid gap-8 md:grid-cols-2 md:items-start">
                    <div className="motion-fade-up" style={{ "--delay": "90ms" }}>
                        <p className="text-sm font-bold uppercase tracking-[0.18em] text-cyan-200">Become a host</p>
                        <h2 className="mt-2 text-3xl font-black md:text-5xl">Turn your city knowledge into income</h2>
                        <p className="mt-4 text-slate-300">
                            College students, freelancers, and long-time residents can host tourists and earn per experience while building trust and ratings.
                        </p>

                        <div className="mt-6 rounded-2xl border border-cyan-200/20 bg-cyan-300/10 p-5">
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-200">Income snapshot</p>
                            <p className="mt-2 text-3xl font-black text-white">INR 1,500 to 5,000</p>
                            <p className="mt-1 text-sm text-slate-200">Typical per hosted day depending on category and city demand.</p>
                        </div>
                    </div>

                    <div className="motion-fade-up space-y-4" style={{ "--delay": "170ms" }}>
                        <div className="grid gap-3 sm:grid-cols-2">
                            {[
                                "Set available hours",
                                "Pick your host categories",
                                "Accept or decline requests",
                                "Get paid for your time"
                            ].map((item, idx) => (
                                <article key={item} className="motion-card motion-fade-up rounded-xl border border-white/15 bg-white/5 p-4 text-sm font-semibold text-slate-100" style={{ "--delay": `${210 + idx * 85}ms` }}>
                                    {item}
                                </article>
                            ))}
                        </div>

                        <div className="rounded-2xl border border-white/15 bg-slate-900/40 p-5">
                            <p className="text-xs font-bold uppercase tracking-[0.14em] text-cyan-100">Trust and safety</p>
                            <ul className="mt-3 space-y-2 text-sm text-slate-200">
                                {hostTrustSignals.map((item) => (
                                    <li key={item} className="flex gap-2">
                                        <span className="mt-1 inline-block h-2.5 w-2.5 rounded-full bg-cyan-300" />
                                        <span>{item}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </section>

            <section className="bg-[#f8fafc] py-20 text-slate-900">
                <div className="container-page">
                    <div className="motion-fade-up flex flex-wrap items-end justify-between gap-4" style={{ "--delay": "80ms" }}>
                        <div>
                            <p className="text-sm font-bold uppercase tracking-[0.18em] text-slate-500">Product Flow</p>
                            <h2 className="mt-1 text-3xl font-black md:text-4xl">Launch your flow</h2>
                        </div>
                        <p className="text-sm font-semibold text-slate-600">One platform for onboarding, matching, chat, and AI planning.</p>
                    </div>
                    <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-5">
                        {flowLinks.map((item, idx) => (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`motion-card motion-fade-up rounded-2xl border px-4 py-4 text-center text-sm font-bold text-slate-800 shadow-[0_10px_30px_rgba(15,23,42,0.08)] ${idx % 2 === 0 ? "border-slate-200 bg-white hover:bg-slate-50" : "border-cyan-100 bg-cyan-50/60 hover:bg-cyan-50"}`}
                                style={{ "--delay": `${120 + idx * 85}ms` }}
                            >
                                {item.label}
                            </Link>
                        ))}
                    </div>
                </div>
            </section>

            <footer className="relative overflow-hidden bg-slate-950 py-14 text-slate-300">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_15%_15%,rgba(45,212,191,0.18),transparent_28%),radial-gradient(circle_at_85%_0%,rgba(56,189,248,0.16),transparent_30%)]" />
                <div className="container-page relative z-10">
                    <div className="rounded-2xl border border-white/15 bg-white/5 p-6 backdrop-blur-sm md:flex md:items-center md:justify-between">
                        <div>
                            <p className="text-xs font-bold uppercase tracking-[0.16em] text-teal-200">Traverse Network</p>
                            <h2 className="mt-2 text-2xl font-black text-white md:text-3xl">Ready to explore with real locals?</h2>
                            <p className="mt-2 text-sm text-slate-300">Join as a host or tourist and let AI orchestrate category-based city experiences.</p>
                        </div>
                        <Link href="/signup" className="mt-4 inline-flex rounded-xl bg-white px-5 py-3 text-sm font-extrabold text-slate-900 transition hover:bg-slate-200 md:mt-0">
                            Join Traverse
                        </Link>
                    </div>

                    <div className="mt-10 grid gap-8 md:grid-cols-[1.1fr_1fr]">
                        <div>
                            <p className="text-2xl font-black text-white">Traverse</p>
                            <p className="mt-3 max-w-md text-sm text-slate-300">
                                Built for real locals and real travelers. Marketplace-first, trust-led, and AI-powered for category-driven city plans.
                            </p>
                            <p className="mt-5 text-xs font-semibold uppercase tracking-[0.14em] text-slate-400">hello@traverse.travel</p>
                        </div>

                        <div className="grid gap-6 sm:grid-cols-3">
                            {footerColumns.map((column) => (
                                <div key={column.title}>
                                    <p className="text-sm font-bold uppercase tracking-[0.14em] text-slate-200">{column.title}</p>
                                    <ul className="mt-3 space-y-2 text-sm text-slate-400">
                                        {column.links.map((item) => (
                                            <li key={item}>
                                                <a href="#" className="transition hover:text-white">
                                                    {item}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="mt-10 border-t border-white/15 pt-4 text-xs text-slate-400 md:flex md:items-center md:justify-between">
                        <p>Traverse 2026. Community-powered exploration.</p>
                        <p className="mt-2 md:mt-0">Not a travel agency. Host marketplace platform.</p>
                    </div>
                </div>
            </footer>
        </main>
    );
}
