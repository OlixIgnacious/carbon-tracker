// ============================================================
// Badge Definitions
// ============================================================

import type { Badge } from './types';

export const BADGE_DEFINITIONS: Omit<Badge, 'unlockedAt'>[] = [
  {
    id: 'first_step',
    name: 'First Step',
    description: 'Log your first activity',
    icon: '🌱',
    category: 'onboarding',
  },
  {
    id: 'streak_3',
    name: '3-Day Streak',
    description: 'Log activities 3 days in a row',
    icon: '🔥',
    category: 'streaks',
  },
  {
    id: 'streak_7',
    name: '7-Day Streak',
    description: 'Log activities 7 days in a row',
    icon: '🔥',
    category: 'streaks',
  },
  {
    id: 'streak_30',
    name: '30-Day Streak',
    description: 'Log activities 30 days in a row',
    icon: '🔥',
    category: 'streaks',
  },
  {
    id: 'pedal_power',
    name: 'Pedal Power',
    description: 'Log 10 cycling or walking trips',
    icon: '🚲',
    category: 'transport',
  },
  {
    id: 'train_champion',
    name: 'Train Champion',
    description: 'Choose train for 5 trips',
    icon: '🚆',
    category: 'transport',
  },
  {
    id: 'veggie_week',
    name: 'Veggie Week',
    description: 'Log no meat for 7 consecutive days',
    icon: '🥗',
    category: 'food',
  },
  {
    id: 'energy_saver',
    name: 'Energy Saver',
    description: 'Log electricity below 5 kWh for 7 days',
    icon: '⚡',
    category: 'energy',
  },
  {
    id: 'ten_percent_reducer',
    name: '10% Reducer',
    description: 'Reduce weekly emissions by 10% vs previous week',
    icon: '📉',
    category: 'progress',
  },
  {
    id: 'carbon_neutral_day',
    name: 'Carbon Neutral Day',
    description: 'Achieve less than 2 kg CO₂e in a single day',
    icon: '🌍',
    category: 'progress',
  },
  {
    id: 'eco_warrior',
    name: 'Eco Warrior',
    description: 'Earn 5 other badges',
    icon: '🏆',
    category: 'meta',
  },
];

export function initializeBadges(): Badge[] {
  return BADGE_DEFINITIONS.map((def) => ({
    ...def,
    unlockedAt: null,
  }));
}
