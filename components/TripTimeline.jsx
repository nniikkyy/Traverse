export default function TripTimeline({ days }) {
    return (
        <div className="space-y-4">
            {days.map((day) => (
                <article key={day.day} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_15px_40px_rgba(15,23,42,0.08)]">
                    <h3 className="text-xl font-black">Day {day.day}</h3>
                    <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                        {day.items.map((item) => (
                            <li key={item}>{item}</li>
                        ))}
                    </ul>
                </article>
            ))}
        </div>
    );
}
