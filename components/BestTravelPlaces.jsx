import Image from "next/image";

const PLACES = [
    { name: "Goa", tours: 18, image: "https://images.unsplash.com/photo-1587922546307-776227941871?auto=format&fit=crop&w=1200&q=80" },
    { name: "Manali", tours: 13, image: "https://images.unsplash.com/photo-1626621341517-bbf3d9990a23?auto=format&fit=crop&w=1200&q=80" },
    { name: "Jaipur", tours: 21, image: "https://images.unsplash.com/photo-1599661046289-e31897846e41?auto=format&fit=crop&w=1200&q=80" },
    { name: "Kerala", tours: 16, image: "https://images.unsplash.com/photo-1602216056096-3b40cc0c9944?auto=format&fit=crop&w=1200&q=80" },
    { name: "Ladakh", tours: 10, image: "https://images.unsplash.com/photo-1617895153857-82fe79adfcd4?auto=format&fit=crop&w=1200&q=80" },
    { name: "Kashmir", tours: 14, image: "https://images.unsplash.com/photo-1598091383021-15ddea10925d?auto=format&fit=crop&w=1200&q=80" }
];

export default function BestTravelPlaces() {
    return (
        <section className="section-wrap py-14" id="destinations">
            <h2 className="section-title">Best Travel Places</h2>
            <p className="section-subtitle">Top India picks crafted for premium escapes</p>

            <div className="mt-8 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
                {PLACES.map((place) => (
                    <article key={place.name} className="group relative h-96 overflow-hidden rounded-2xl shadow-soft">
                        <Image src={place.image} alt={place.name} fill className="object-cover transition duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
                        <div className="absolute bottom-4 left-4 text-white">
                            <h3 className="text-3xl font-bold">{place.name}</h3>
                            <p className="text-sm text-slate-200">{place.tours} Tours</p>
                        </div>
                    </article>
                ))}
            </div>
        </section>
    );
}
