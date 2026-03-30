const TIPS = [
    "Travel during shoulder seasons for better prices and smaller crowds.",
    "Use local transport apps and book intercity transfers in advance.",
    "Carry digital + physical ID copies and keep emergency cash.",
    "Start early for major attractions to avoid traffic and long queues."
];

export default function TravelTips() {
    return (
        <section className="section-wrap py-14" id="tips">
            <div className="overflow-hidden rounded-3xl border border-slate-200 bg-gradient-to-br from-slate-900 via-slate-800 to-cyan-900 p-8 shadow-soft">
                <h2 className="text-4xl font-black text-white md:text-5xl">Travel Tips</h2>
                <div className="mt-6 grid gap-4 md:grid-cols-2">
                    {TIPS.map((tip) => (
                        <article key={tip} className="rounded-xl border border-white/30 bg-white/95 p-4">
                            <p className="text-slate-800">{tip}</p>
                        </article>
                    ))}
                </div>
            </div>
        </section>
    );
}
