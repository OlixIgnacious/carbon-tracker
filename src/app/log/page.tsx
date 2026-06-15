'use client';

import { useState } from 'react';
import { useCarbon } from '@/context/CarbonContext';
import { TransportForm } from '@/components/log/TransportForm';
import { EnergyForm } from '@/components/log/EnergyForm';
import { FoodForm } from '@/components/log/FoodForm';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';

type Category = 'transport' | 'energy' | 'food';

const CATEGORIES: { id: Category; label: string; icon: string; description: string }[] = [
  { id: 'transport', label: 'Transport', icon: '🚗', description: 'Car, bus, train, flight, cycling' },
  { id: 'energy', label: 'Energy', icon: '⚡', description: 'Electricity, gas, water usage' },
  { id: 'food', label: 'Food', icon: '🍽️', description: 'Meals and food consumption' },
];

export default function LogPage() {
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const { recentlyUnlockedBadges, badges, clearRecentBadges } = useCarbon();

  const handleSuccess = (message: string) => {
    setSuccessMessage(message);
    setSelectedCategory(null);
    setTimeout(() => setSuccessMessage(null), 4000);
  };

  // Show badge unlock celebration
  const newBadges = recentlyUnlockedBadges
    .map((id) => badges.find((b) => b.id === id))
    .filter(Boolean);

  return (
    <ProtectedRoute>
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        {/* Header */}
        <section>
          <h1 className="text-3xl font-bold text-carbon-100 tracking-tight">
            Log Activity
          </h1>
          <p className="text-carbon-400 mt-1">
            Record your daily activities to track your carbon footprint
          </p>
        </section>

        {/* Success Toast */}
        {successMessage && (
          <div
            className="bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 px-4 py-3 rounded-xl animate-slide-up flex items-center gap-2"
            role="alert"
          >
            <span aria-hidden="true">✅</span>
            <span className="text-sm font-medium">{successMessage}</span>
          </div>
        )}

        {/* Badge Unlock Celebration */}
        {newBadges.length > 0 && (
          <div
            className="bg-amber-500/15 border border-amber-500/30 text-amber-300 px-4 py-4 rounded-xl animate-slide-up"
            role="alert"
          >
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg animate-confetti" aria-hidden="true">🎉</span>
              <span className="font-semibold text-sm">Badge Unlocked!</span>
            </div>
            {newBadges.map((badge) => badge && (
              <div key={badge.id} className="flex items-center gap-2 text-sm">
                <span aria-hidden="true">{badge.icon}</span>
                <span className="font-medium">{badge.name}</span>
                <span className="text-amber-500/70">— {badge.description}</span>
              </div>
            ))}
            <button
              onClick={clearRecentBadges}
              className="mt-2 text-xs text-amber-500/50 hover:text-amber-400 transition-colors"
            >
              Dismiss
            </button>
          </div>
        )}

        {/* Category Selector */}
        {!selectedCategory && (
          <section className="space-y-4">
            <h2 className="text-lg font-semibold text-carbon-200">
              What would you like to log?
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 stagger-children">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className="glass-card p-6 text-left hover:border-emerald-500/30 transition-all group cursor-pointer"
                  id={`log-category-${cat.id}`}
                >
                  <span className="text-4xl block mb-3 group-hover:scale-110 transition-transform" aria-hidden="true">
                    {cat.icon}
                  </span>
                  <h3 className="font-semibold text-carbon-200 mb-1">{cat.label}</h3>
                  <p className="text-xs text-carbon-500">{cat.description}</p>
                </button>
              ))}
            </div>
          </section>
        )}

        {/* Category-Specific Forms */}
        {selectedCategory && (
          <div className="animate-slide-up">
            <button
              onClick={() => setSelectedCategory(null)}
              className="flex items-center gap-2 text-sm text-carbon-400 hover:text-carbon-200 transition-colors mb-4"
            >
              <span aria-hidden="true">←</span> Back to categories
            </button>

            {selectedCategory === 'transport' && (
              <TransportForm onSuccess={handleSuccess} />
            )}
            {selectedCategory === 'energy' && (
              <EnergyForm onSuccess={handleSuccess} />
            )}
            {selectedCategory === 'food' && (
              <FoodForm onSuccess={handleSuccess} />
            )}
          </div>
        )}

        {/* Recent Activities */}
        <RecentActivities />
      </div>
    </ProtectedRoute>
  );
}

function RecentActivities() {
  const { activities, deleteActivity } = useCarbon();
  const recent = [...activities].reverse().slice(0, 5);

  if (recent.length === 0) return null;

  return (
    <section>
      <h2 className="text-lg font-semibold text-carbon-200 mb-4">
        Recent Activities
      </h2>
      <div className="space-y-2 stagger-children">
        {recent.map((activity) => (
          <div
            key={activity.id}
            className="glass-card p-4 flex items-center justify-between"
          >
            <div className="flex items-center gap-3">
              <span className="text-xl" aria-hidden="true">
                {activity.type === 'transport' ? '🚗' : activity.type === 'energy' ? '⚡' : '🍽️'}
              </span>
              <div>
                <p className="text-sm font-medium text-carbon-200">
                  {activity.type.charAt(0).toUpperCase() + activity.type.slice(1)}
                  {activity.type === 'transport' && ` — ${activity.mode.replace(/_/g, ' ')}`}
                  {activity.type === 'energy' && ` — ${activity.source.replace(/_/g, ' ')}`}
                  {activity.type === 'food' && ` — ${activity.category}`}
                </p>
                <p className="text-xs text-carbon-500">{activity.date}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm font-semibold text-emerald-400">
                {activity.co2e.toFixed(2)} kg
              </span>
              <button
                onClick={() => deleteActivity(activity.id)}
                className="text-carbon-600 hover:text-red-400 transition-colors p-1"
                aria-label={`Delete ${activity.type} activity from ${activity.date}`}
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
