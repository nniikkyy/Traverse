export default function SignupPage() {
    return (
        <main className="min-h-screen bg-[#eef6fa] py-16 text-slate-900">
            <section className="container-page max-w-2xl rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_60px_rgba(15,23,42,0.12)]">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Get started</p>
                <h1 className="mt-2 text-4xl font-black">Join as a host or a tourist</h1>
                <p className="mt-3 text-slate-600">Local hosts can earn by guiding travelers. Tourists can match with trusted locals and generate AI category plans.</p>
                <div className="mt-7 grid gap-4">
                    <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Full name" />
                    <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Email" />
                    <select className="rounded-xl border border-slate-300 px-4 py-3">
                        <option value="traveler">Traveler</option>
                        <option value="host">Host</option>
                    </select>
                    <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="City" />
                    <input className="rounded-xl border border-slate-300 px-4 py-3" placeholder="Preferred language" />
                    <button className="rounded-xl bg-slate-900 px-5 py-3 font-bold text-white transition hover:bg-slate-800">Continue</button>
                </div>
            </section>
        </main>
    );
}
