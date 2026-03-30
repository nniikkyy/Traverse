import os
from openai import OpenAI


def generate_itinerary(city, interests, budget):
    prompt = f"""
    Plan a 3-day trip in {city} for {interests} within {budget}.
    Include local hidden places.
    """

    api_key = os.getenv("OPENAI_API_KEY")
    if not api_key:
        return "Add OPENAI_API_KEY to enable live itinerary generation"

    client = OpenAI(api_key=api_key)
    response = client.chat.completions.create(
        model="gpt-5.3",
        messages=[{"role": "user", "content": prompt}]
    )

    return response.choices[0].message.content
