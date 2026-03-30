import ChatUI from "../../components/ChatUI";

export default function ChatPage() {
    return (
        <main className="min-h-screen bg-slate-100 py-16">
            <section className="container-page">
                <h1 className="text-3xl font-bold">AI Chat Assistant</h1>
                <p className="mt-2 text-slate-600">Real-time translation, negotiation help, and travel advice.</p>
                <div className="mt-6 max-w-3xl">
                    <ChatUI />
                </div>
            </section>
        </main>
    );
}
