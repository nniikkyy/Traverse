import PreferenceForm from "../../components/PreferenceForm";

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-[#eef6fa] py-16 text-slate-900">
            <section className="container-page">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">Traveler profile</p>
                <h1 className="mt-2 text-4xl font-black">Build your exploration profile</h1>
                <p className="mt-2 text-slate-600">Select city, budget vibe, and interests. AI uses this with host traits to create category-specific day plans.</p>
                <div className="mt-6">
                    <PreferenceForm />
                </div>
            </section>
        </main>
    );
}
