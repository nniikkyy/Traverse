export default function TripTimeline({ days }) {
    return (
        <div className="space-y-4">
            {days.map((day) => (
                <article key={day.day} className="rounded-xl border border-slate-200 bg-white p-4 shadow-soft">
                    <h3 className="text-lg font-bold">Day {day.day}</h3>
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
