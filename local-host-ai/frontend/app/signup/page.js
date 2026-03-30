export default function SignupPage() {
    return (
        <main className="min-h-screen bg-slate-100 py-16">
            <section className="container-page max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-soft">
                <h1 className="text-3xl font-bold">Sign up / Login</h1>
                <div className="mt-6 grid gap-3">
                    <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Name" />
                    <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Email" />
                    <select className="rounded-lg border border-slate-300 px-3 py-2">
                        <option value="traveler">Traveler</option>
                        <option value="host">Host</option>
                    </select>
                    <input className="rounded-lg border border-slate-300 px-3 py-2" placeholder="Preferred Language" />
                    <button className="rounded-lg bg-slate-900 px-4 py-2 font-semibold text-white">Continue</button>
                </div>
            </section>
        </main>
    );
}
