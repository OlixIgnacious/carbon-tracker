'use client';

import { useState, useEffect } from 'react';
import { useCarbon } from '@/context/CarbonContext';
import type { Region } from '@/lib/types';

export function OnboardingModal() {
  const { profile, updateProfile, isHydrated } = useCarbon();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [region, setRegion] = useState<Region>('global');

  useEffect(() => {
    // Check if hydrated and if it is the first visit
    if (isHydrated && profile.isFirstVisit) {
      setIsOpen(true);
    }
  }, [isHydrated, profile.isFirstVisit]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    updateProfile({
      name: name || 'Eco Explorer',
      region,
      isFirstVisit: false,
    });
    setIsOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon-950/80 backdrop-blur-sm animate-fade-in">
      <div className="glass-card w-full max-w-md p-6 animate-slide-up shadow-2xl shadow-emerald-500/10">
        <div className="text-center mb-6">
          <span className="text-5xl block mb-2" aria-hidden="true">🌍</span>
          <h2 className="text-2xl font-bold text-carbon-100">Welcome to CarbonTracker</h2>
          <p className="text-carbon-400 text-sm mt-2">
            Let&apos;s personalize your experience. No account required—everything stays securely on your device.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="user-name" className="block text-sm font-medium text-carbon-300 mb-1">
              What should we call you?
            </label>
            <input
              id="user-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Alex"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-carbon-200 placeholder:text-carbon-600
                         focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
            />
          </div>

          <div>
            <label htmlFor="user-region" className="block text-sm font-medium text-carbon-300 mb-1">
              Which region are you in?
            </label>
            <p className="text-xs text-carbon-500 mb-2">
              This helps us compare your footprint against accurate local averages.
            </p>
            <select
              id="user-region"
              value={region}
              onChange={(e) => setRegion(e.target.value as Region)}
              className="w-full bg-carbon-900 border border-white/10 rounded-xl px-4 py-3 text-carbon-200
                         focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all appearance-none"
            >
              <option value="global">Global Average</option>
              <option value="us">United States</option>
              <option value="uk">United Kingdom</option>
              <option value="eu">European Union</option>
              <option value="asia">Asia</option>
            </select>
          </div>

          <button
            type="submit"
            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 mt-2"
          >
            Start Tracking
          </button>
        </form>
      </div>
    </div>
  );
}
