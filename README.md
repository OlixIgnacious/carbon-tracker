# Carbon Tracker

A smart, dynamic assistant that helps users understand, track, and reduce their personal carbon footprint through activity logging, AI-driven insights, interactive visualizations, and gamified challenges.

## Features

- **Activity Logging**: Log transport, energy, and food consumption. Real-time CO₂e emission previews.
- **Data Visualization**: Interactive line and doughnut charts to visualize emission trends and categorical breakdown.
- **Gamification**: Streaks, achievements, and badges to encourage consistent tracking and sustainable choices.
- **AI-Powered Insights Engine**: Uses Google Gemini to analyze your data and provide specific, actionable reduction recommendations. Fallback to curated recommendations if API is unavailable.
- **Local Storage**: All personal data is stored securely in your browser's `localStorage` — no databases, no tracking.

## Technology Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **Charts**: Chart.js v4
- **AI Integration**: Google Generative AI (Gemini 2.0 Flash)

## Setup and Running

1. **Clone the repository** (or download the source).
2. **Install dependencies**:
   ```bash
   npm install
   ```
3. **Set up Environment Variables**:
   Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```
   Add your Gemini API key (from [Google AI Studio](https://aistudio.google.com/)) to `.env.local`:
   ```
   GEMINI_API_KEY=your_actual_key_here
   ```
4. **Run the development server**:
   ```bash
   npm run dev
   ```
5. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Architecture & Storage

- **Context-driven state**: Global state managed via React Context (`src/context/CarbonContext.tsx`).
- **Hydration safety**: State relies entirely on client-side `localStorage`, reading strictly after component mount.
- **Server Actions/API**: Gemini API calls are securely processed server-side in `src/app/api/insights/route.ts` to protect API keys.

## Methodology

Emission calculations use reliable factors from:
- UK Government DEFRA/DESNZ Greenhouse Gas Conversion Factors 2024
- Poore & Nemecek (2018), *Science*

See the **About & Methodology** page in the app for full tables of conversion factors.

## Challenge Vertical

Built as a submission for **Challenge Vertical 3: The Carbon Tracker** (Sustainability Persona).
