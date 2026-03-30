const LINKS = ["Home", "About Us", "Packages", "Destinations", "Contact"];

export default function Footer() {
    return (
        <footer className="relative mt-10 overflow-hidden text-white">
            <div
                className="absolute inset-0 bg-cover bg-center"
                style={{
                    backgroundImage:
                        "linear-gradient(180deg, rgba(3, 10, 20, 0.7), rgba(2, 8, 16, 0.92)), url('https://images.unsplash.com/photo-1447752875215-b2761acb3c5d?auto=format&fit=crop&w=2000&q=80')"
                }}
            />

            <div className="section-wrap relative z-10 grid gap-8 py-14 md:grid-cols-3">
                <section>
                    <h3 className="text-2xl font-black">Traverse</h3>
                    <p className="mt-3 max-w-sm text-slate-200">
                        Premium India-only travel platform for curated holidays, local experiences, and smooth journeys.
                    </p>
                </section>

                <section>
                    <h4 className="text-lg font-bold">Links</h4>
                    <ul className="mt-3 space-y-2 text-slate-200">
                        {LINKS.map((item) => (
                            <li key={item}>
                                <a href="#" className="transition hover:text-orange-200">
                                    {item}
                                </a>
                            </li>
                        ))}
                    </ul>
                </section>

                <section>
                    <h4 className="text-lg font-bold">Contact</h4>
                    <p className="mt-3 text-slate-200">hello@traverse.travel</p>
                    <p className="text-slate-200">+91 98765 43210</p>
                    <div className="mt-4 flex gap-3">
                        {['IG', 'FB', 'YT', 'X'].map((icon) => (
                            <button
                                key={icon}
                                type="button"
                                className="h-9 w-9 rounded-full border border-white/40 bg-white/10 text-xs font-bold transition hover:bg-white/20"
                            >
                                {icon}
                            </button>
                        ))}
                    </div>
                </section>
            </div>
        </footer>
    );
}
