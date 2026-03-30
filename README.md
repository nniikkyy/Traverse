# Traverse | AI Travel Planner Agent India

A modern React + Vite travel web app that helps users build budget-friendly itineraries across India.

## Features

- Clean card-based responsive UI
- Landing hero section inspired by travel journeys
- Inputs for state/UT, city, days, budget, and interests
- India-wide location dataset (all states and UTs with extensive city options)
- Loading state while generating itinerary
- Structured day-wise output with places, food, and tips
- Copy itinerary button
- Regenerate itinerary button
- Uses Gemini API when `VITE_GEMINI_API_KEY` is set
- Falls back to local planner logic if API key is not present

## Run locally

1. Install dependencies:

```bash
npm install
```

2. Optional: create `.env` and add:

```bash
VITE_GEMINI_API_KEY=your_api_key_here
```

3. Start development server:

```bash
npm run dev
```

4. Build production bundle:

```bash
npm run build
```
