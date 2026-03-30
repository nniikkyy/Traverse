const NAV_LINKS = [
    "Home",
    "About Us",
    "Our Services",
    "Destinations",
    "Contact"
];

export default function Navbar() {
    return (
        <header className="absolute inset-x-0 top-0 z-30">
            <div className="section-wrap pt-5">
                <nav className="flex items-center justify-between rounded-2xl border border-white/30 bg-black/25 px-4 py-3 text-white backdrop-blur-xl md:px-6">
                    <p className="text-xl font-extrabold tracking-wide">Traverse</p>

                    <ul className="hidden gap-6 text-sm font-medium lg:flex">
                        {NAV_LINKS.map((link) => (
                            <li key={link}>
                                <a className="transition hover:text-orange-200" href="#">
                                    {link}
                                </a>
                            </li>
                        ))}
                    </ul>

                    <button className="rounded-full border border-white/40 bg-white/90 px-5 py-2 text-sm font-semibold text-slate-900 transition hover:bg-orange-100">
                        Login
                    </button>
                </nav>
            </div>
        </header>
    );
}
