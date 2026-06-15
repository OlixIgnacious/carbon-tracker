'use client';

import { useEffect, useState } from 'react';
import { useCarbon } from '@/context/CarbonContext';
import { getChallengeForDate } from '@/lib/challenges';
import type { DailyChallenge } from '@/lib/types';

export function DailyChallengeCard() {
  const { challenges, updateChallenge, isHydrated } = useCarbon();
  const [todayChallenge, setTodayChallenge] = useState<DailyChallenge | null>(null);

  useEffect(() => {
    if (!isHydrated) return;

    const todayStr = new Date().toISOString().split('T')[0];
    let challenge = challenges.find((c) => c.date === todayStr);

    if (!challenge) {
      // It's a new day or no challenge was generated yet, so get today's challenge
      challenge = getChallengeForDate(todayStr);
      // We don't save it to context immediately to avoid unnecessary writes if they ignore it,
      // but it will be saved when they interact with it.
    }

    setTodayChallenge(challenge);
  }, [challenges, isHydrated]);

  if (!todayChallenge) return null;

  const handleAction = (status: 'accepted' | 'completed' | 'skipped') => {
    const updated = { ...todayChallenge, status };
    setTodayChallenge(updated);
    updateChallenge(updated);
  };

  return (
    <div className="glass-card p-6 border-amber-500/20 bg-amber-500/5">
      <div className="flex items-start justify-between">
        <div>
          <h3 className="text-lg font-semibold text-amber-400 flex items-center gap-2">
            <span aria-hidden="true">🎯</span> Daily Challenge
          </h3>
          <h4 className="text-carbon-200 font-medium mt-2 flex items-center gap-2">
            <span aria-hidden="true">{todayChallenge.icon}</span> {todayChallenge.title}
          </h4>
          <p className="text-sm text-carbon-400 mt-1">{todayChallenge.description}</p>
        </div>
        
        <div className="text-right">
          {todayChallenge.status === 'pending' && (
            <div className="flex flex-col gap-2 mt-2">
              <button
                onClick={() => handleAction('accepted')}
                className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors"
              >
                Accept Challenge
              </button>
              <button
                onClick={() => handleAction('skipped')}
                className="text-carbon-500 hover:text-carbon-400 text-xs transition-colors"
              >
                Skip
              </button>
            </div>
          )}
          
          {todayChallenge.status === 'accepted' && (
            <button
              onClick={() => handleAction('completed')}
              className="bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-semibold px-4 py-2 rounded-lg transition-colors mt-2"
            >
              Mark Complete
            </button>
          )}

          {todayChallenge.status === 'completed' && (
            <div className="text-emerald-400 font-medium text-sm flex items-center gap-1 mt-2">
              <span aria-hidden="true">✅</span> Completed!
            </div>
          )}

          {todayChallenge.status === 'skipped' && (
            <div className="text-carbon-500 text-sm mt-2">Skipped for today.</div>
          )}
        </div>
      </div>
    </div>
  );
}
