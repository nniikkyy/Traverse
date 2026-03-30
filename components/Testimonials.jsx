const TESTIMONIALS = [
    {
        name: "Rohan Mehta",
        review: "Our Kerala trip was perfectly planned. Hotels, local experiences, and transfers were seamless.",
        stars: 5
    },
    {
        name: "Aisha Khan",
        review: "Loved the Ladakh itinerary. It balanced adventure with enough rest and great food recommendations.",
        stars: 5
    },
    {
        name: "Dev Sharma",
        review: "Premium service with practical pricing. The Jaipur heritage route was beautifully curated.",
        stars: 4
    }
];

export default function Testimonials() {
    return (
        <section className="section-wrap py-14">
            <h2 className="section-title">Testimonials</h2>
            <div className="mt-8 grid gap-5 md:grid-cols-3">
                {TESTIMONIALS.map((item) => (
                    <article key={item.name} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-soft card-hover">
                        <p className="text-xl text-amber-500">{"★".repeat(item.stars)}{"☆".repeat(5 - item.stars)}</p>
                        <p className="mt-3 text-slate-700">{item.review}</p>
                        <p className="mt-4 text-lg font-bold text-slate-900">{item.name}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
