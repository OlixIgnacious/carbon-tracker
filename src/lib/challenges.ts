import type { DailyChallenge } from './types';

export const CHALLENGES_POOL: Omit<DailyChallenge, 'id' | 'status' | 'date'>[] = [
  {
    title: 'Meatless Monday',
    description: 'Avoid meat for the entire day.',
    category: 'food',
    icon: '🥗',
  },
  {
    title: 'Zero-Emission Commute',
    description: 'Walk or cycle for your daily commute.',
    category: 'transport',
    icon: '🚲',
  },
  {
    title: 'Energy Fast',
    description: 'Keep electricity usage under 5 kWh today.',
    category: 'energy',
    icon: '⚡',
  },
  {
    title: 'Public Transit Day',
    description: 'Take the bus or train instead of driving.',
    category: 'transport',
    icon: '🚆',
  },
  {
    title: 'Plant-based Milk',
    description: 'Swap dairy milk for a plant-based alternative today.',
    category: 'food',
    icon: '🥛',
  },
];

// Returns a deterministic challenge based on the current date string (YYYY-MM-DD)
export function getChallengeForDate(dateStr: string): DailyChallenge {
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = dateStr.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % CHALLENGES_POOL.length;
  const baseChallenge = CHALLENGES_POOL[index];

  return {
    ...baseChallenge,
    id: `challenge_${dateStr}`,
    date: dateStr,
    status: 'pending',
  };
}
