'use client';

import { useState } from 'react';
import { useCarbon } from '@/context/CarbonContext';
import type { FoodCategory } from '@/lib/types';
import {
  calculateFoodEmission,
  FOOD_LABELS,
  FOOD_ICONS,
  FOOD_FACTORS,
} from '@/lib/emission-factors';

interface Props {
  onSuccess: (message: string) => void;
}

const CATEGORIES = Object.keys(FOOD_LABELS) as FoodCategory[];

const PORTION_HINTS: Record<FoodCategory, string> = {
  beef: '1 steak ≈ 0.25 kg',
  lamb: '1 chop ≈ 0.15 kg',
  cheese: '1 slice ≈ 0.03 kg',
  pork: '1 pork chop ≈ 0.2 kg',
  chicken: '1 breast ≈ 0.2 kg',
  fish: '1 fillet ≈ 0.15 kg',
  eggs: '1 egg ≈ 0.06 kg',
  rice: '1 cooked portion ≈ 0.2 kg',
  milk: '1 glass ≈ 0.25 kg',
  vegetables: '1 portion ≈ 0.15 kg',
  fruits: '1 apple ≈ 0.18 kg',
  legumes: '1 can of beans ≈ 0.4 kg',
};

export function FoodForm({ onSuccess }: Props) {
  const { addActivity } = useCarbon();
  const [category, setCategory] = useState<FoodCategory>('chicken');
  const [weight, setWeight] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const weightNum = parseFloat(weight) || 0;
  const preview = calculateFoodEmission(category, weightNum);

  // Create comparison to petrol car driving
  const carEquivalentKm = preview > 0 ? (preview / 0.17).toFixed(1) : '0';

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (weightNum <= 0) return;

    addActivity({
      type: 'food',
      category,
      weightKg: weightNum,
      date,
      co2e: preview,
    });

    onSuccess(`Logged ${weightNum} kg of ${FOOD_LABELS[category].toLowerCase()} — ${preview.toFixed(2)} kg CO₂e`);
    setWeight('');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
      <h2 className="text-xl font-semibold text-carbon-200 flex items-center gap-2">
        <span aria-hidden="true">🍽️</span> Log Food
      </h2>

      {/* Food Category Grid */}
      <fieldset>
        <legend className="text-sm font-medium text-carbon-300 mb-3">Food Category</legend>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className={`p-3 rounded-xl text-center text-xs font-medium transition-all cursor-pointer
                ${category === cat
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                  : 'bg-white/3 border border-white/5 text-carbon-400 hover:bg-white/5'
                }
              `}
              aria-pressed={category === cat}
            >
              <span className="text-xl block mb-1" aria-hidden="true">{FOOD_ICONS[cat]}</span>
              {FOOD_LABELS[cat]}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Weight */}
      <div>
        <label htmlFor="food-weight" className="block text-sm font-medium text-carbon-300 mb-2">
          Weight (kg)
        </label>
        <input
          id="food-weight"
          type="number"
          min="0"
          step="0.01"
          value={weight}
          onChange={(e) => setWeight(e.target.value)}
          placeholder="e.g. 0.25"
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-carbon-200 placeholder:text-carbon-600
                     focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
        />
        <p className="mt-1 text-xs text-carbon-500">
          {PORTION_HINTS[category]} • Factor: {FOOD_FACTORS[category]} kg CO₂e/kg
        </p>
      </div>

      {/* Date */}
      <div>
        <label htmlFor="food-date" className="block text-sm font-medium text-carbon-300 mb-2">
          Date
        </label>
        <input
          id="food-date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          max={new Date().toISOString().split('T')[0]}
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-carbon-200
                     focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
        />
      </div>

      {/* Live Preview */}
      {weightNum > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 animate-fade-in space-y-1">
          <p className="text-sm text-emerald-400 font-medium">
            Estimated emission: <span className="text-lg font-bold">{preview.toFixed(2)}</span> kg CO₂e
          </p>
          <p className="text-xs text-emerald-500/70">
            Equivalent to driving {carEquivalentKm} km in a petrol car
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={weightNum <= 0}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-carbon-700 disabled:text-carbon-500
                   text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200
                   hover:shadow-lg hover:shadow-emerald-500/20 disabled:cursor-not-allowed"
      >
        Log Activity
      </button>
    </form>
  );
}
