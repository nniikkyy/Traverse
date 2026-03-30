export default function HostCard({ host, onRequest }) {
    return (
        <article className="rounded-2xl border border-slate-200 bg-white p-5 shadow-soft">
            <h3 className="text-xl font-bold">{host.name}</h3>
            <p className="mt-1 text-sm text-slate-600">{host.city} · {host.bio}</p>
            <p className="mt-3 text-sm text-slate-700">Languages: {host.languages.join(", ")}</p>
            <p className="mt-1 text-sm text-slate-700">Interests: {host.interests.join(", ")}</p>
            <p className="mt-1 text-sm font-semibold text-emerald-700">Rating: {host.rating}</p>
            <button
                type="button"
                onClick={() => onRequest(host.id)}
                className="mt-4 rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white hover:bg-slate-800"
            >
                Request Host
            </button>
        </article>
    );
}
