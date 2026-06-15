# 🌍 CarbonTracker

**CarbonTracker** is an interactive, gamified, and AI-powered web application designed to help individuals understand, track, and reduce their daily carbon footprint. 

Built for the **Prompt Wars Challenge (Vertical 3: The Carbon Tracker)**, it strictly adheres to a completely serverless, database-free architecture under a 10MB repository limit while offering advanced features like real-time tracking, intelligent insights, and engaging gamification.

---

## ✨ Core Features

- **Activity Logging & Ingestion**: Track transit (car, flight, public transport, bicycle), home utilities (electricity, water, heating), and food choices (beef, poultry, plant-based). Real-time calculations convert these activities into scientific kg CO₂e metrics.
- **Personalized Insights Engine**: Integrated with **Google Gemini 2.0 Flash**. The AI reads your recent aggregated carbon data and generates personalized, actionable, and realistic reduction steps.
- **Local vs Global Tracking**: A personalized onboarding flow allows users to select their geographical region (e.g., US, UK, EU, Asia). The tracker dynamically compares their personal footprint against their exact regional average—all done locally without requiring a central database!
- **Data Visualization**: Stunning, interactive Chart.js visualizations including a 30-day emissions line chart and a categorical footprint doughnut chart.
- **Gamified Actions & Streaks**: 
  - **Badges**: Unlock 11 unique badges across different categories (e.g., "Zero-Emission Commute", "Plant-based Pioneer").
  - **Streaks**: A robust daily streak system featuring a "Streak Freeze" mechanic to keep users motivated without punishing occasional misses.
  - **Daily Challenges**: A rotating pool of deterministic daily challenges (e.g., "Meatless Monday") that users can accept and complete for extra engagement.
- **Authentication Abstraction**: Features beautiful Login and Registration UI wrappers powered by a flexible `AuthContext`. Currently mocked via `localStorage` for the challenge, but perfectly architected to instantly plug into **Firebase** or **Supabase** Auth in the future.

---

## 🚀 Tech Stack

- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4 (Glass-morphism design system)
- **Charts**: Chart.js / react-chartjs-2
- **AI Integration**: `@google/generative-ai` (Gemini API via Server Route Handlers)
- **Testing**: Vitest (Unit testing for calculation and gamification logic)
- **Persistence**: Strict `localStorage` hydration (Zero server-side database dependencies)

---

## 🛠️ Getting Started

### 1. Prerequisites
- Node.js (v18+)
- A Google Gemini API Key (Optional, but required for AI insights)

### 2. Installation
Clone the repository and install dependencies:
```bash
git clone https://github.com/OlixIgnacious/carbon-tracker.git
cd carbon-tracker
npm install
```

### 3. Environment Variables
Create a `.env.local` file in the root directory and add your Gemini API Key:
```env
GEMINI_API_KEY=your_api_key_here
```

### 4. Running the App
Start the Next.js development server:
```bash
npm run dev
```
Open `http://localhost:3000` in your browser.

### 5. Running Tests
Run the Vitest test suite to validate emission factors and streak logic:
```bash
npm run test
```

---

## 🔮 Future Roadmap & Enhancements

Based on recent open-source research and academic developments in personal carbon tracking, here are several high-impact features planned for future iterations:

1. **Carbon Credit Score System**: Similar to a financial credit score, users start with a baseline score that fluctuates based on their monthly emission deltas, creating a highly engaging long-term metric.
2. **Community Leaderboards**: Once connected to Firebase/Supabase, users can form groups (workplaces, schools, friends) and compete on regional or private leaderboards.
3. **Automated Data Integration**: Syncing with smart home APIs (e.g., Nest, Hive) or fitness APIs (Strava, Apple Health) to automatically log energy usage and zero-emission transit (cycling/walking) without manual input.
4. **Educational Hub & Multilingual Support**: Expanding the application to include short micro-learning modules about climate change, and translating the interface using `next-intl` to reach a global audience.
5. **Computer Vision Scanning**: Allowing users to take a photo of their utility bill or grocery receipt, using Gemini Multimodal AI to automatically extract and log the carbon footprint of their purchases.

---

*Designed and engineered for the Prompt Wars Challenge.*
