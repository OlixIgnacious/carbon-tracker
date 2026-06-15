// ============================================================
// Static Fallback Insights
// Used when Gemini API is unavailable or no API key configured
// ============================================================

export interface InsightRecommendation {
  title: string;
  description: string;
  estimatedSavingKgCO2e: number;
  difficulty: 'easy' | 'medium' | 'hard';
  category: 'transport' | 'energy' | 'food' | 'general';
}

export const FALLBACK_INSIGHTS: InsightRecommendation[] = [
  // Transport
  {
    title: 'Switch to public transport once a week',
    description: 'Replace one weekly car commute with bus or train. A 20km round trip saves significant emissions over a year.',
    estimatedSavingKgCO2e: 1.4,
    difficulty: 'easy',
    category: 'transport',
  },
  {
    title: 'Cycle for trips under 5 km',
    description: 'Short car trips are the least efficient due to cold engines. Cycling eliminates these emissions entirely.',
    estimatedSavingKgCO2e: 0.85,
    difficulty: 'easy',
    category: 'transport',
  },
  {
    title: 'Carpool to work',
    description: 'Sharing a ride with one colleague halves your per-person transport emissions immediately.',
    estimatedSavingKgCO2e: 1.7,
    difficulty: 'medium',
    category: 'transport',
  },
  {
    title: 'Take the train instead of flying domestically',
    description: 'A 500km train journey produces about 20 kg CO₂e vs 65 kg for a flight — a 70% reduction.',
    estimatedSavingKgCO2e: 45.0,
    difficulty: 'medium',
    category: 'transport',
  },
  {
    title: 'Work from home one day per week',
    description: 'Eliminating a daily commute one day per week can save 500+ kg CO₂e annually for average car commuters.',
    estimatedSavingKgCO2e: 1.7,
    difficulty: 'easy',
    category: 'transport',
  },

  // Energy
  {
    title: 'Switch to LED bulbs throughout your home',
    description: 'LED bulbs use 75% less electricity than incandescent bulbs and last 25 times longer.',
    estimatedSavingKgCO2e: 0.3,
    difficulty: 'easy',
    category: 'energy',
  },
  {
    title: 'Reduce thermostat by 1°C',
    description: 'Lowering your heating by just 1°C can reduce your heating bill and emissions by up to 10%.',
    estimatedSavingKgCO2e: 2.5,
    difficulty: 'easy',
    category: 'energy',
  },
  {
    title: 'Air-dry laundry instead of using a tumble dryer',
    description: 'A tumble dryer uses 2-5 kWh per cycle. Air-drying eliminates this entirely.',
    estimatedSavingKgCO2e: 0.7,
    difficulty: 'easy',
    category: 'energy',
  },
  {
    title: 'Switch to a renewable energy tariff',
    description: 'Many energy providers offer 100% renewable electricity tariffs at competitive rates.',
    estimatedSavingKgCO2e: 5.0,
    difficulty: 'medium',
    category: 'energy',
  },
  {
    title: 'Unplug devices on standby',
    description: 'Standby power accounts for 5-10% of household electricity use. Use power strips for easy switching.',
    estimatedSavingKgCO2e: 0.2,
    difficulty: 'easy',
    category: 'energy',
  },

  // Food
  {
    title: 'Have one meat-free day per week',
    description: 'Replacing a beef meal with a plant-based alternative saves approximately 6 kg CO₂e per meal.',
    estimatedSavingKgCO2e: 6.0,
    difficulty: 'easy',
    category: 'food',
  },
  {
    title: 'Replace beef with chicken',
    description: 'Chicken produces roughly 75% less emissions than beef per kg. A simple swap with big impact.',
    estimatedSavingKgCO2e: 5.0,
    difficulty: 'easy',
    category: 'food',
  },
  {
    title: 'Buy seasonal and local produce',
    description: 'Out-of-season produce often travels by air. Seasonal local food has a much smaller footprint.',
    estimatedSavingKgCO2e: 1.5,
    difficulty: 'medium',
    category: 'food',
  },
  {
    title: 'Reduce food waste',
    description: 'About 30% of food produced is wasted. Plan meals, store food properly, and use leftovers.',
    estimatedSavingKgCO2e: 3.0,
    difficulty: 'medium',
    category: 'food',
  },
  {
    title: 'Choose plant-based milk',
    description: 'Oat milk produces about 0.9 kg CO₂e per litre vs 3.2 kg for dairy milk — a 70% reduction.',
    estimatedSavingKgCO2e: 2.3,
    difficulty: 'easy',
    category: 'food',
  },

  // General
  {
    title: 'Track your footprint daily',
    description: 'Awareness is the first step. Regular tracking helps identify your biggest emission sources.',
    estimatedSavingKgCO2e: 0,
    difficulty: 'easy',
    category: 'general',
  },
  {
    title: 'Set a weekly carbon budget',
    description: 'Aim for under 70 kg CO₂e per week (about 10 kg/day). This is below the UK average of 91 kg/week.',
    estimatedSavingKgCO2e: 3.0,
    difficulty: 'medium',
    category: 'general',
  },
];

/**
 * Get filtered insights based on the user's highest emission category.
 * Returns top insights prioritizing the category with highest emissions.
 */
export function getFilteredInsights(
  topCategory: 'transport' | 'energy' | 'food' | null,
  count: number = 5
): InsightRecommendation[] {
  if (!topCategory) {
    return FALLBACK_INSIGHTS.slice(0, count);
  }

  const prioritized = FALLBACK_INSIGHTS.filter((i) => i.category === topCategory);
  const others = FALLBACK_INSIGHTS.filter((i) => i.category !== topCategory);

  return [...prioritized, ...others].slice(0, count);
}
