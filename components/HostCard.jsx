export default function HostCard({ host, onRequest }) {
    return (
        <article className="rounded-3xl border border-slate-200 bg-white p-6 shadow-[0_18px_50px_rgba(15,23,42,0.1)]">
            <p className="text-xs font-extrabold uppercase tracking-[0.16em] text-teal-700">{host.city} host</p>
            <h3 className="mt-2 text-2xl font-black">{host.name}</h3>
            <p className="mt-2 text-sm text-slate-600">{host.bio}</p>
            <p className="mt-4 text-sm text-slate-700"><span className="font-bold">Languages:</span> {host.languages.join(", ")}</p>
            <p className="mt-1 text-sm text-slate-700"><span className="font-bold">Categories:</span> {host.interests.join(", ")}</p>
            <p className="mt-2 text-sm font-bold text-emerald-700">Trust score: {host.rating}</p>
            <button
                type="button"
                onClick={() => onRequest(host.id)}
                className="mt-5 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white transition hover:bg-slate-800"
            >
                Request this host
            </button>
        </article>
    );
}
