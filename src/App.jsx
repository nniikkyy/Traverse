import { useMemo, useState } from "react";
import { INDIA_LOCATIONS, getTotalCities } from "./indiaLocations";

const INTEREST_OPTIONS = [
    "food",
    "nightlife",
    "history",
    "nature",
    "shopping"
];

const DAY_OPTIONS = [1, 2, 3, 4, 5, 6, 7];

const BUDGET_OPTIONS = [
    { label: "₹1000", value: "1000" },
    { label: "₹2000", value: "2000" },
    { label: "₹3000", value: "3000" },
    { label: "₹5000", value: "5000" },
    { label: "₹7000", value: "7000" },
    { label: "₹10000+", value: "10000+" }
];

const TRAVEL_BANDS = ["Escapes", "Adventures", "Experiences", "Expeditions"];

const EXPERIENCE_COPY = [
    { title: "Escapes", text: "Short refreshing breaks with scenic views and easy logistics." },
    { title: "Adventures", text: "Mountain trails, coast rides, and thrilling local activities." },
    { title: "Experiences", text: "Culture-first itineraries curated around local life and food." },
    { title: "Expeditions", text: "Longer route plans across multiple destinations and terrains." }
];

const TRAVEL_TIPS = [
    {
        title: "Plan Around Local Transit",
        body: "Use metro, state buses, and shared cabs for budget-friendly movement inside cities."
    },
    {
        title: "Start Early, Save More",
        body: "Morning slots reduce queue time at monuments and help avoid surge pricing."
    },
    {
        title: "Eat Where Locals Eat",
        body: "Smaller, crowded local eateries often deliver authentic and affordable meals."
    }
];

const INFLUENCING = [
    { name: "Wanderlust Thirst", focus: "Backpacking + local food trails" },
    { name: "Roadbound India", focus: "Scenic drives and mountain routes" },
    { name: "Culture Miles", focus: "History-led city walks and forts" }
];

const BLOGS = [
    {
        title: "How to Plan a 5-Day India Trip on a Budget",
        excerpt: "A practical checklist for routes, stays, food spend, and transport choices."
    },
    {
        title: "Best Time to Visit Top Indian States",
        excerpt: "Season-wise travel windows to help you avoid crowds and weather surprises."
    },
    {
        title: "Street Food Safety Tips for Travelers",
        excerpt: "Simple habits to enjoy authentic local food while minimizing health risks."
    }
];

function getStateImageUrl(stateName, index) {
    const query = encodeURIComponent(`${stateName} india travel landscape`);
    return `https://source.unsplash.com/800x600/?${query}&sig=${index + 1}`;
}

function buildPrompt({ state, city, days, budget, interests }) {
    return `You are an intelligent India-focused travel planning agent.

Your job is to create a practical, budget-friendly, and realistic travel itinerary.

Inputs:
- City
- Number of days
- Budget (in INR)
- Interests

Rules:
- Focus on real places in India (local spots + popular places)
- Suggest affordable options based on budget
- Include street food/local food recommendations
- Avoid overly expensive or unrealistic plans
- Include travel tips (transport, safety, timing)
- Keep it structured day-wise
- Make it feel like advice from a local person

Output format:

Day 1:
- Places:
- Food:
- Tips:

Day 2:
...

Keep the tone friendly, helpful, and realistic.

User input:
- State/UT: ${state}
- City: ${city}
- Number of days: ${days}
- Budget: ${budget}
- Interests: ${interests.join(", ") || "general exploration"}`;
}

async function generateFromGemini(promptText) {
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey) return null;

    const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
        {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptText }] }],
                generationConfig: {
                    temperature: 0.7,
                    topP: 0.9
                }
            })
        }
    );

    if (!response.ok) {
        throw new Error("AI service unavailable right now. Please try again.");
    }

    const data = await response.json();
    return data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("\n") || null;
}

function fallbackPlan({ state, city, days, interests }) {
    const places = [
        `Old city markets in ${city}`,
        `A major landmark and museum in ${city}`,
        `A public garden or lakefront in ${city}`,
        `Popular local neighborhoods in ${city}`
    ];
    const foods = [
        "Street chaat and regional snacks",
        "Local thali at a budget-friendly eatery",
        "Morning chai and bakery items",
        "Famous local sweet dish"
    ];
    const tips = [
        "Use metro or local buses in peak traffic hours.",
        "Start early to avoid crowds and midday heat.",
        "Keep small cash for local markets and autos.",
        "Use verified ride apps at night for safer travel."
    ];

    let result = "";
    for (let i = 1; i <= days; i += 1) {
        const interestText = interests.length
            ? `Try one activity focused on ${interests[(i - 1) % interests.length]}.`
            : "Mix sightseeing, food walks, and local culture.";

        result += `Day ${i}:\n`;
        result += `- Places: ${places[(i - 1) % places.length]}, plus a nearby local spot in ${state}.\n`;
        result += `- Food: ${foods[(i - 1) % foods.length]} from hygienic stalls.\n`;
        result += `- Tips: ${tips[(i - 1) % tips.length]} ${interestText}\n\n`;
    }

    return result.trim();
}

function parseItinerary(rawText) {
    const lines = rawText.split(/\r?\n/);
    const days = [];
    let currentDay = null;
    let currentSection = null;

    for (const line of lines) {
        const value = line.trim();
        if (!value) continue;

        if (/^day\s*\d+/i.test(value)) {
            currentDay = {
                title: value.replace(/:$/, ""),
                places: [],
                food: [],
                tips: []
            };
            days.push(currentDay);
            currentSection = null;
            continue;
        }

        if (!currentDay) continue;

        const normalized = value.toLowerCase();
        if (normalized.includes("places")) {
            currentSection = "places";
        } else if (normalized.includes("food")) {
            currentSection = "food";
        } else if (normalized.includes("tips")) {
            currentSection = "tips";
        }

        const cleaned = value.replace(/^[-*•]\s*/, "").replace(/^(places|food|tips)\s*:\s*/i, "").trim();

        if (cleaned && currentSection) {
            currentDay[currentSection].push(cleaned);
        }
    }

    return days;
}

function formatForCopy(days) {
    return days
        .map((day) => {
            const places = day.places.map((p) => `- Places: ${p}`).join("\n");
            const food = day.food.map((f) => `- Food: ${f}`).join("\n");
            const tips = day.tips.map((t) => `- Tips: ${t}`).join("\n");
            return `${day.title}:\n${places}\n${food}\n${tips}`;
        })
        .join("\n\n");
}

export default function App() {
    const [stateName, setStateName] = useState("Karnataka");
    const [city, setCity] = useState("Bengaluru");
    const [days, setDays] = useState("3");
    const [budget, setBudget] = useState("3000");
    const [selectedInterests, setSelectedInterests] = useState(["food", "history"]);
    const [customInterests, setCustomInterests] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [itinerary, setItinerary] = useState([]);
    const [copied, setCopied] = useState(false);

    const totalCities = useMemo(() => getTotalCities(), []);

    const cityOptions = useMemo(() => {
        return INDIA_LOCATIONS.find((region) => region.state === stateName)?.cities || [];
    }, [stateName]);

    const allDestinations = useMemo(() => {
        return INDIA_LOCATIONS.map((region) => ({
            state: region.state,
            city: region.cities[0],
            tours: Math.max(4, region.cities.length + 2)
        }));
    }, []);

    const allInterests = useMemo(() => {
        const custom = customInterests
            .split(",")
            .map((item) => item.trim())
            .filter(Boolean);
        return [...new Set([...selectedInterests, ...custom])];
    }, [selectedInterests, customInterests]);

    const toggleInterest = (interest) => {
        setSelectedInterests((prev) =>
            prev.includes(interest) ? prev.filter((i) => i !== interest) : [...prev, interest]
        );
    };

    const goToPlanner = () => {
        const section = document.getElementById("planner");
        if (section) section.scrollIntoView({ behavior: "smooth", block: "start" });
    };

    const handleStateChange = (nextState) => {
        setStateName(nextState);
        const nextCities = INDIA_LOCATIONS.find((region) => region.state === nextState)?.cities || [];
        setCity(nextCities[0] || "");
    };

    const handleGenerate = async () => {
        if (!stateName || !city.trim()) {
            setError("Please choose a state and city first.");
            return;
        }

        setLoading(true);
        setError("");
        setCopied(false);

        try {
            const input = {
                state: stateName,
                city: city.trim(),
                days: Number(days),
                budget,
                interests: allInterests
            };

            const prompt = buildPrompt(input);
            const aiText = (await generateFromGemini(prompt)) || fallbackPlan(input);
            const parsed = parseItinerary(aiText);

            if (!parsed.length) {
                throw new Error("Could not parse itinerary. Please regenerate.");
            }

            setItinerary(parsed);
        } catch (err) {
            setError(err.message || "Something went wrong. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const handleCopy = async () => {
        if (!itinerary.length) return;
        await navigator.clipboard.writeText(formatForCopy(itinerary));
        setCopied(true);
        setTimeout(() => setCopied(false), 1800);
    };

    const handleHeroSearch = () => {
        if (!stateName || !city) return;
        goToPlanner();
    };

    return (
        <main className="page">
            <div className="sky-layer" />

            <div className="top-ribbon">
                <p>Embark on a voyage of authentic experiences across India.</p>
            </div>

            <header className="site-nav">
                <div className="brand">
                    <strong>Traverse</strong>
                    <span>AI Travel Planner India</span>
                </div>
                <nav>
                    <a href="#">Home</a>
                    <a href="#destinations">Destinations</a>
                    <a href="#planner">Planner</a>
                    <a href="#tips">Travel Tips</a>
                </nav>
                <button type="button" className="btn nav-btn" onClick={goToPlanner}>
                    Plan My Trip
                </button>
            </header>

            <section className="hero-banner">
                <div className="hero-backdrop" />
                <div className="hero-copy">
                    <p className="badge">Traverse</p>
                    <h1>Get Ready For New Journeys</h1>
                    <p>
                        From weekend escapes to long expeditions, build practical, budget-friendly India
                        itineraries in seconds.
                    </p>
                </div>

                <div className="hero-search">
                    <label>
                        State / UT
                        <select value={stateName} onChange={(e) => handleStateChange(e.target.value)}>
                            {INDIA_LOCATIONS.map((region) => (
                                <option key={region.state} value={region.state}>
                                    {region.state}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        City
                        <select value={city} onChange={(e) => setCity(e.target.value)}>
                            {cityOptions.map((cityItem) => (
                                <option key={cityItem} value={cityItem}>
                                    {cityItem}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Duration
                        <select value={days} onChange={(e) => setDays(e.target.value)}>
                            {DAY_OPTIONS.map((day) => (
                                <option key={day} value={String(day)}>
                                    {day} day{day > 1 ? "s" : ""}
                                </option>
                            ))}
                        </select>
                    </label>

                    <button type="button" className="btn cta" onClick={handleHeroSearch}>
                        Search
                    </button>
                </div>

                <div className="hero-stats">
                    <article>
                        <span>36</span>
                        <p>States &amp; UTs</p>
                    </article>
                    <article>
                        <span>{totalCities}</span>
                        <p>Cities available</p>
                    </article>
                    <article>
                        <span>AI</span>
                        <p>Budget-first planning</p>
                    </article>
                </div>
            </section>

            <section className="journey-strip" aria-label="Travel styles">
                {TRAVEL_BANDS.map((band) => (
                    <article key={band} className="journey-pill">
                        <span>{band}</span>
                    </article>
                ))}
            </section>

            <section className="panel experiences-panel">
                <div className="panel-head">
                    <h3>Authentic Experiences</h3>
                    <p>Choose your travel style and let Traverse adapt the journey around it</p>
                </div>
                <div className="experience-grid">
                    {EXPERIENCE_COPY.map((item) => (
                        <article key={item.title} className="experience-card">
                            <h4>{item.title}</h4>
                            <p>{item.text}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="panel destinations-panel" id="destinations">
                <div className="panel-head">
                    <h3>All India States &amp; UTs</h3>
                    <p>Pick any destination across India and start your AI-crafted route instantly</p>
                </div>
                <div className="dest-grid all-states-grid">
                    {allDestinations.map((item, index) => (
                        <button
                            type="button"
                            key={item.state}
                            className="dest-card state-image-card"
                            onClick={() => {
                                handleStateChange(item.state);
                                setCity(item.city);
                                goToPlanner();
                            }}
                        >
                            <img
                                src={getStateImageUrl(item.state, index)}
                                alt={`${item.state} travel view`}
                                loading="lazy"
                            />
                            <div className="state-card-overlay" />
                            <div className="state-card-copy">
                                <strong>{item.state}</strong>
                                <span>{item.city}</span>
                                <em>{item.tours} tours</em>
                            </div>
                        </button>
                    ))}
                </div>
            </section>

            <section className="panel tips-panel" id="tips">
                <div className="panel-head">
                    <h3>Travel Tips</h3>
                    <p>Simple hacks for smoother and smarter trips</p>
                </div>
                <div className="tips-grid">
                    {TRAVEL_TIPS.map((tip) => (
                        <article key={tip.title} className="tip-card">
                            <h4>{tip.title}</h4>
                            <p>{tip.body}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="panel influencing-panel">
                <div className="panel-head">
                    <h3>Influencing</h3>
                    <p>Voices from travelers shaping route choices and experiences</p>
                </div>
                <div className="influencer-grid">
                    {INFLUENCING.map((item) => (
                        <article key={item.name} className="influencer-card">
                            <h4>{item.name}</h4>
                            <p>{item.focus}</p>
                        </article>
                    ))}
                </div>
            </section>

            <section className="panel blogs-panel">
                <div className="panel-head">
                    <h3>Our Blogs</h3>
                    <p>Fresh travel guidance for planning smarter India itineraries</p>
                </div>
                <div className="blog-grid">
                    {BLOGS.map((item) => (
                        <article key={item.title} className="blog-card">
                            <h4>{item.title}</h4>
                            <p>{item.excerpt}</p>
                            <button type="button" className="btn blog-btn" onClick={goToPlanner}>
                                Read via Planner
                            </button>
                        </article>
                    ))}
                </div>
            </section>

            <section className="card" id="planner">
                <header className="header">
                    <h2>Traverse Planner</h2>
                    <p>Plan your trip across India with AI</p>
                </header>

                <div className="form-grid">
                    <label>
                        State / UT
                        <select value={stateName} onChange={(e) => handleStateChange(e.target.value)}>
                            {INDIA_LOCATIONS.map((region) => (
                                <option key={region.state} value={region.state}>
                                    {region.state}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        City
                        <select
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        >
                            {cityOptions.map((cityItem) => (
                                <option key={cityItem} value={cityItem}>
                                    {cityItem}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Number of Days
                        <select value={days} onChange={(e) => setDays(e.target.value)}>
                            {DAY_OPTIONS.map((day) => (
                                <option key={day} value={String(day)}>
                                    {day} day{day > 1 ? "s" : ""}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Budget
                        <select value={budget} onChange={(e) => setBudget(e.target.value)}>
                            {BUDGET_OPTIONS.map((item) => (
                                <option key={item.value} value={item.value}>
                                    {item.label}
                                </option>
                            ))}
                        </select>
                    </label>

                    <label>
                        Add Interests (comma separated)
                        <input
                            type="text"
                            value={customInterests}
                            onChange={(e) => setCustomInterests(e.target.value)}
                            placeholder="temples, beaches, art"
                        />
                    </label>
                </div>

                <div className="chips" aria-label="Interest presets">
                    {INTEREST_OPTIONS.map((interest) => {
                        const active = selectedInterests.includes(interest);
                        return (
                            <button
                                type="button"
                                key={interest}
                                className={active ? "chip active" : "chip"}
                                onClick={() => toggleInterest(interest)}
                            >
                                {interest}
                            </button>
                        );
                    })}
                </div>

                <div className="actions">
                    <button type="button" className="btn primary" onClick={handleGenerate} disabled={loading}>
                        {loading ? "AI is planning your trip..." : "Generate Travel Plan"}
                    </button>

                    {!!itinerary.length && !loading && (
                        <button type="button" className="btn" onClick={handleGenerate}>
                            Regenerate Plan
                        </button>
                    )}
                </div>

                {error ? <p className="error">{error}</p> : null}

                {!!itinerary.length && !loading && (
                    <section className="result fade-in" aria-live="polite">
                        <div className="result-head">
                            <h2>Your Itinerary</h2>
                            <button type="button" className="btn copy" onClick={handleCopy}>
                                {copied ? "Copied" : "Copy Itinerary"}
                            </button>
                        </div>

                        {itinerary.map((day) => (
                            <article key={day.title} className="day-block">
                                <h3>{day.title}</h3>

                                <div className="section-row">
                                    <strong>📍 Places</strong>
                                    <ul>
                                        {day.places.map((item, idx) => (
                                            <li key={`${day.title}-place-${idx}`}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="section-row">
                                    <strong>🍜 Food</strong>
                                    <ul>
                                        {day.food.map((item, idx) => (
                                            <li key={`${day.title}-food-${idx}`}>{item}</li>
                                        ))}
                                    </ul>
                                </div>

                                <div className="section-row">
                                    <strong>💡 Tips</strong>
                                    <ul>
                                        {day.tips.map((item, idx) => (
                                            <li key={`${day.title}-tip-${idx}`}>{item}</li>
                                        ))}
                                    </ul>
                                </div>
                            </article>
                        ))}
                    </section>
                )}
            </section>

            <footer className="footer">
                <div>
                    <h5>Traverse</h5>
                    <p>Built with AI for real-world travel in India.</p>
                </div>
                <div>
                    <h5>Solutions</h5>
                    <a href="#planner">AI Planner</a>
                    <a href="#destinations">Destinations</a>
                    <a href="#tips">Travel Tips</a>
                </div>
                <div>
                    <h5>Quick Links</h5>
                    <a href="#">Blogs</a>
                    <a href="#">Gallery</a>
                    <a href="#">FAQs</a>
                </div>
            </footer>
        </main>
    );
}
