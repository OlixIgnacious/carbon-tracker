'use client';

import { getNarrative } from '@/lib/emission-factors';

interface Props {
  todayTotal: number;
  weeklyTotal: number;
}

export function NarrativeInsight({ todayTotal, weeklyTotal }: Props) {
  const todayNarrative = getNarrative(todayTotal);
  const weeklyNarrative = getNarrative(weeklyTotal);

  if (todayTotal === 0 && weeklyTotal === 0) {
    return (
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-carbon-200 mb-3">
          💬 Your Impact Story
        </h3>
        <p className="text-carbon-400 text-sm">
          Start logging your activities to see personalized impact narratives here.
          Every journey to a smaller footprint begins with a single step.
        </p>
      </div>
    );
  }

  return (
    <div className="glass-card p-6">
      <h3 className="text-lg font-semibold text-carbon-200 mb-4">
        💬 Your Impact Story
      </h3>
      <div className="space-y-4">
        {todayTotal > 0 && (
          <div className="flex items-start gap-3 animate-fade-in">
            <span className="text-emerald-500 mt-0.5" aria-hidden="true">◉</span>
            <div>
              <p className="text-sm text-carbon-300 font-medium">Today</p>
              <p className="text-sm text-carbon-400 mt-0.5">{todayNarrative}</p>
            </div>
          </div>
        )}
        {weeklyTotal > 0 && (
          <div className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: '0.1s' }}>
            <span className="text-blue-500 mt-0.5" aria-hidden="true">◉</span>
            <div>
              <p className="text-sm text-carbon-300 font-medium">This Week</p>
              <p className="text-sm text-carbon-400 mt-0.5">{weeklyNarrative}</p>
            </div>
          </div>
        )}
        {todayTotal > 0 && todayTotal < 8 && (
          <div className="flex items-start gap-3 animate-fade-in" style={{ animationDelay: '0.2s' }}>
            <span className="text-emerald-400 mt-0.5" aria-hidden="true">★</span>
            <p className="text-sm text-emerald-400/80">
              Great job! You&apos;re below the daily average of 13 kg CO₂e.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
