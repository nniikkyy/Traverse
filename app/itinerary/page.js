import TripTimeline from "../../components/TripTimeline";

const demoDays = [
    { day: 1, items: ["Old Delhi food walk", "Jama Masjid", "Chandni Chowk market"] },
    { day: 2, items: ["Humayun's Tomb", "Lodhi Garden", "Local art cafes"] },
    { day: 3, items: ["Dilli Haat", "India Gate evening", "Street shopping + dinner"] }
];

export default function ItineraryPage() {
    return (
        <main className="min-h-screen bg-[#eef6fa] py-16 text-slate-900">
            <section className="container-page">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Category itinerary</p>
                <h1 className="mt-2 text-4xl font-black">Your AI-built city game plan</h1>
                <p className="mt-2 text-slate-600">Day-by-day recommendations based on your category choices and host matching profile.</p>
                <div className="mt-6 max-w-3xl">
                    <TripTimeline days={demoDays} />
                </div>
            </section>
        </main>
    );
}
