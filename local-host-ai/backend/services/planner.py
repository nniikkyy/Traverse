import os

from openai import OpenAI


def generate_itinerary(city, interests, budget, days=3):
    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return {
            "days": [
                {"day": 1, "items": [f"Explore local markets in {city}",
                                     "Try regional breakfast", "Evening heritage walk"]},
                {"day": 2, "items": ["Visit key monuments",
                                     "Local lunch spots", "Cultural show"]},
                {"day": 3, "items": ["Hidden neighborhood tour",
                                     "Street food trail", "Sunset viewpoint"]}
            ],
            "note": "Fallback itinerary generated without API key"
        }

    prompt = (
        f"Plan a {days}-day trip in {city} for interests: {', '.join(interests)} within budget {budget}. "
        "Include practical local recommendations and hidden places."
    )

    client = OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-5.3",
        messages=[{"role": "user", "content": prompt}]
    )

    return {"raw": response.choices[0].message.content}
