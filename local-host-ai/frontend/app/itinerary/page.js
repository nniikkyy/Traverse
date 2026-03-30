import TripTimeline from "../../components/TripTimeline";

const demoDays = [
    { day: 1, items: ["Old Delhi food walk", "Jama Masjid", "Chandni Chowk market"] },
    { day: 2, items: ["Humayun's Tomb", "Lodhi Garden", "Local art cafes"] },
    { day: 3, items: ["Dilli Haat", "India Gate evening", "Street shopping + dinner"] }
];

export default function ItineraryPage() {
    return (
        <main className="min-h-screen bg-slate-100 py-16">
            <section className="container-page">
                <h1 className="text-3xl font-bold">AI Itinerary</h1>
                <p className="mt-2 text-slate-600">3-day smart itinerary generated from your preferences.</p>
                <div className="mt-6 max-w-3xl">
                    <TripTimeline days={demoDays} />
                </div>
            </section>
        </main>
    );
}
