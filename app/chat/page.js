import ChatUI from "../../components/ChatUI";

export default function ChatPage() {
    return (
        <main className="min-h-screen bg-[#eef6fa] py-16 text-slate-900">
            <section className="container-page">
                <p className="text-sm font-bold uppercase tracking-[0.18em] text-teal-700">AI co-pilot</p>
                <h1 className="mt-2 text-4xl font-black">Ask before you explore</h1>
                <p className="mt-2 text-slate-600">Use AI for translation help, pricing context, route suggestions, and local etiquette tips.</p>
                <div className="mt-6 max-w-3xl">
                    <ChatUI />
                </div>
            </section>
        </main>
    );
}
