"use client";

import { useEffect, useState } from "react";

export default function FloatingButtons() {
    const [showTop, setShowTop] = useState(false);

    useEffect(() => {
        const onScroll = () => setShowTop(window.scrollY > 380);
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

    return (
        <>
            <a
                href="https://wa.me/919876543210"
                target="_blank"
                rel="noreferrer"
                className="fixed bottom-6 left-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-green-500 text-xl text-white shadow-xl transition hover:scale-105"
                aria-label="WhatsApp"
            >
                W
            </a>

            {showTop ? (
                <button
                    type="button"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    className="fixed bottom-6 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full bg-slate-900 text-lg text-white shadow-xl transition hover:bg-slate-800"
                    aria-label="Scroll to top"
                >
                    ↑
                </button>
            ) : null}
        </>
    );
}
