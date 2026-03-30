import PreferenceForm from "../../components/PreferenceForm";

export default function DashboardPage() {
    return (
        <main className="min-h-screen bg-slate-100 py-16">
            <section className="container-page">
                <h1 className="text-3xl font-bold">Traveler Dashboard</h1>
                <p className="mt-2 text-slate-600">Set your budget, interests, language and city to personalize recommendations.</p>
                <div className="mt-6">
                    <PreferenceForm />
                </div>
            </section>
        </main>
    );
}
