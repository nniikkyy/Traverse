import Image from "next/image";

const DESTINATIONS = [
    { name: "Himachal Pradesh", image: "https://images.unsplash.com/photo-1597074866923-dc0589150358?auto=format&fit=crop&w=1300&q=80" },
    { name: "Rajasthan", image: "https://images.unsplash.com/photo-1599661046827-dacde697654f?auto=format&fit=crop&w=1300&q=80" },
    { name: "Uttarakhand", image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?auto=format&fit=crop&w=1300&q=80" },
    { name: "Andaman & Nicobar", image: "https://images.unsplash.com/photo-1589394815804-964ed0be2eb5?auto=format&fit=crop&w=1300&q=80" },
    { name: "Lakshadweep", image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1300&q=80" },
    { name: "Sikkim", image: "https://images.unsplash.com/photo-1624306122807-d03f5f6d57a0?auto=format&fit=crop&w=1300&q=80" }
];

export default function PopularDestinations() {
    return (
        <section className="section-wrap pb-14">
            <h2 className="section-title">Popular Destinations</h2>
            <div className="mt-8 grid auto-rows-[280px] gap-5 md:grid-cols-3">
                {DESTINATIONS.map((item, index) => (
                    <article
                        key={item.name}
                        className={`group relative overflow-hidden rounded-2xl shadow-soft ${index === 0 || index === 3 ? "md:col-span-2" : ""}`}
                    >
                        <Image src={item.image} alt={item.name} fill className="object-cover transition duration-500 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                        <p className="absolute bottom-4 left-4 text-2xl font-bold text-white">{item.name}</p>
                    </article>
                ))}
            </div>
        </section>
    );
}
