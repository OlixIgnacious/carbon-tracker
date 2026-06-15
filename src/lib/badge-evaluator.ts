// ============================================================
// Badge Evaluator — Pure functions to check badge criteria
// ============================================================

import type { Activity, Badge, UserProfile } from './types';

interface EvaluationContext {
  activities: Activity[];
  profile: UserProfile;
  badges: Badge[];
}

/**
 * Evaluates all badge criteria and returns updated badges array.
 * Also returns IDs of newly unlocked badges for celebration UI.
 */
export function evaluateBadges(ctx: EvaluationContext): {
  badges: Badge[];
  newlyUnlocked: string[];
} {
  const now = new Date().toISOString();
  const newlyUnlocked: string[] = [];
  const badges = ctx.badges.map((badge) => {
    if (badge.unlockedAt) return badge; // Already unlocked

    const shouldUnlock = checkBadgeCriteria(badge.id, ctx);
    if (shouldUnlock) {
      newlyUnlocked.push(badge.id);
      return { ...badge, unlockedAt: now };
    }
    return badge;
  });

  return { badges, newlyUnlocked };
}

function checkBadgeCriteria(badgeId: string, ctx: EvaluationContext): boolean {
  const { activities, profile, badges } = ctx;

  switch (badgeId) {
    case 'first_step':
      return activities.length >= 1;

    case 'streak_3':
      return profile.currentStreak >= 3;

    case 'streak_7':
      return profile.currentStreak >= 7;

    case 'streak_30':
      return profile.currentStreak >= 30;

    case 'pedal_power': {
      const greenTrips = activities.filter(
        (a) => a.type === 'transport' && (a.mode === 'bicycle' || a.mode === 'walking')
      );
      return greenTrips.length >= 10;
    }

    case 'train_champion': {
      const trainTrips = activities.filter(
        (a) => a.type === 'transport' && a.mode === 'train'
      );
      return trainTrips.length >= 5;
    }

    case 'veggie_week': {
      return checkVeggieWeek(activities);
    }

    case 'energy_saver': {
      return checkEnergySaver(activities);
    }

    case 'ten_percent_reducer': {
      return checkTenPercentReducer(activities);
    }

    case 'carbon_neutral_day': {
      return checkCarbonNeutralDay(activities);
    }

    case 'eco_warrior': {
      const unlockedCount = badges.filter((b) => b.unlockedAt !== null && b.id !== 'eco_warrior').length;
      return unlockedCount >= 5;
    }

    default:
      return false;
  }
}

// --- Helper: Check if user had 7 consecutive days with no meat ---
function checkVeggieWeek(activities: Activity[]): boolean {
  const meatCategories = ['beef', 'lamb', 'pork', 'chicken', 'fish'];
  const foodActivities = activities.filter((a) => a.type === 'food');
  if (foodActivities.length === 0) return false;

  // Get all unique dates where user logged food
  const foodDates = [...new Set(foodActivities.map((a) => a.date))].sort();
  const meatDates = new Set(
    foodActivities
      .filter((a) => a.type === 'food' && meatCategories.includes(a.category))
      .map((a) => a.date)
  );

  // Check for 7 consecutive food-logged days with no meat
  let consecutive = 0;
  for (const date of foodDates) {
    if (!meatDates.has(date)) {
      consecutive++;
      if (consecutive >= 7) return true;
    } else {
      consecutive = 0;
    }
  }
  return false;
}

// --- Helper: Check electricity below 5 kWh for 7 days ---
function checkEnergySaver(activities: Activity[]): boolean {
  const electricityByDate = new Map<string, number>();
  activities
    .filter((a) => a.type === 'energy' && a.source === 'electricity')
    .forEach((a) => {
      if (a.type === 'energy') {
        const current = electricityByDate.get(a.date) || 0;
        electricityByDate.set(a.date, current + a.amount);
      }
    });

  const sortedDates = [...electricityByDate.keys()].sort();
  let consecutive = 0;
  for (const date of sortedDates) {
    const usage = electricityByDate.get(date) || 0;
    if (usage > 0 && usage < 5) {
      consecutive++;
      if (consecutive >= 7) return true;
    } else {
      consecutive = 0;
    }
  }
  return false;
}

// --- Helper: Check 10% weekly reduction ---
function checkTenPercentReducer(activities: Activity[]): boolean {
  if (activities.length === 0) return false;

  // Group emissions by ISO week
  const weeklyEmissions = new Map<string, number>();
  activities.forEach((a) => {
    const week = getISOWeek(a.date);
    const current = weeklyEmissions.get(week) || 0;
    weeklyEmissions.set(week, current + a.co2e);
  });

  const weeks = [...weeklyEmissions.keys()].sort();
  if (weeks.length < 2) return false;

  for (let i = 1; i < weeks.length; i++) {
    const prev = weeklyEmissions.get(weeks[i - 1]) || 0;
    const curr = weeklyEmissions.get(weeks[i]) || 0;
    if (prev > 0 && curr <= prev * 0.9) return true;
  }
  return false;
}

// --- Helper: Check any day with < 2 kg CO₂e ---
function checkCarbonNeutralDay(activities: Activity[]): boolean {
  const dailyTotals = new Map<string, number>();
  activities.forEach((a) => {
    const current = dailyTotals.get(a.date) || 0;
    dailyTotals.set(a.date, current + a.co2e);
  });

  for (const total of dailyTotals.values()) {
    if (total > 0 && total < 2) return true;
  }
  return false;
}

// --- Utility: Get ISO week string ---
function getISOWeek(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const jan1 = new Date(year, 0, 1);
  const dayOfYear = Math.floor((date.getTime() - jan1.getTime()) / 86400000) + 1;
  const weekNumber = Math.ceil(dayOfYear / 7);
  return `${year}-W${weekNumber.toString().padStart(2, '0')}`;
}

// --- Streak Calculation ---

export function calculateStreak(
  activities: Activity[],
  currentProfile: UserProfile
): { currentStreak: number; longestStreak: number; lastActiveDate: string | null } {
  if (activities.length === 0) {
    return { currentStreak: 0, longestStreak: currentProfile.longestStreak, lastActiveDate: null };
  }

  const uniqueDates = [...new Set(activities.map((a) => a.date))].sort();
  const today = new Date().toISOString().split('T')[0];
  const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];

  let currentStreak = 0;
  let maxStreak = 0;
  let tempStreak = 1;

  // Calculate streaks from sorted dates
  for (let i = 1; i < uniqueDates.length; i++) {
    const prevDate = new Date(uniqueDates[i - 1]);
    const currDate = new Date(uniqueDates[i]);
    const diffDays = Math.round((currDate.getTime() - prevDate.getTime()) / 86400000);

    if (diffDays === 1) {
      tempStreak++;
    } else if (diffDays === 2 && !currentProfile.streakFreezeUsed) {
      // Streak freeze: allow 1 missed day
      tempStreak++;
    } else {
      tempStreak = 1;
    }
    maxStreak = Math.max(maxStreak, tempStreak);
  }

  // Current streak = streak that includes today or yesterday
  const lastDate = uniqueDates[uniqueDates.length - 1];
  if (lastDate === today || lastDate === yesterday) {
    currentStreak = tempStreak;
  } else {
    currentStreak = 0;
  }

  const longestStreak = Math.max(maxStreak, currentProfile.longestStreak);

  return {
    currentStreak,
    longestStreak,
    lastActiveDate: lastDate,
  };
}
