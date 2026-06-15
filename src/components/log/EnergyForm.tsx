'use client';

import { useState } from 'react';
import { useCarbon } from '@/context/CarbonContext';
import type { EnergySource } from '@/lib/types';
import {
  calculateEnergyEmission,
  ENERGY_LABELS,
  ENERGY_ICONS,
  ENERGY_FACTORS,
} from '@/lib/emission-factors';

interface Props {
  onSuccess: (message: string) => void;
}

const SOURCES = Object.keys(ENERGY_LABELS) as EnergySource[];

const TIPS: Record<EnergySource, string> = {
  electricity: 'Average UK household uses ~8 kWh/day',
  natural_gas: 'Average UK household uses ~33 kWh/day in winter, ~5 kWh/day in summer',
  water: 'Average person uses ~0.15 m³/day (150 litres)',
};

export function EnergyForm({ onSuccess }: Props) {
  const { addActivity } = useCarbon();
  const [source, setSource] = useState<EnergySource>('electricity');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const amountNum = parseFloat(amount) || 0;
  const preview = calculateEnergyEmission(source, amountNum);
  const unit = ENERGY_FACTORS[source].unit;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (amountNum <= 0) return;

    addActivity({
      type: 'energy',
      source,
      amount: amountNum,
      unit: unit as 'kWh' | 'm3',
      date,
      co2e: preview,
    });

    onSuccess(`Logged ${amountNum} ${unit} of ${ENERGY_LABELS[source].toLowerCase()} — ${preview.toFixed(2)} kg CO₂e`);
    setAmount('');
  };

  return (
    <form onSubmit={handleSubmit} className="glass-card p-6 space-y-6">
      <h2 className="text-xl font-semibold text-carbon-200 flex items-center gap-2">
        <span aria-hidden="true">⚡</span> Log Energy Usage
      </h2>

      {/* Source Selector */}
      <fieldset>
        <legend className="text-sm font-medium text-carbon-300 mb-3">Energy Source</legend>
        <div className="grid grid-cols-3 gap-3">
          {SOURCES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSource(s)}
              className={`p-4 rounded-xl text-center text-sm font-medium transition-all cursor-pointer
                ${source === s
                  ? 'bg-emerald-500/20 border border-emerald-500/40 text-emerald-400'
                  : 'bg-white/3 border border-white/5 text-carbon-400 hover:bg-white/5'
                }
              `}
              aria-pressed={source === s}
            >
              <span className="text-2xl block mb-2" aria-hidden="true">{ENERGY_ICONS[s]}</span>
              {ENERGY_LABELS[s]}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Amount */}
      <div>
        <label htmlFor="energy-amount" className="block text-sm font-medium text-carbon-300 mb-2">
          Amount ({unit})
        </label>
        <input
          id="energy-amount"
          type="number"
          min="0"
          step="0.1"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={`e.g. ${source === 'water' ? '0.15' : '8'}`}
          required
          className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-carbon-200 placeholder:text-carbon-600
                     focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/30 transition-all"
        />
        <p className="mt-1 text-xs text-carbon-500">
          {TIPS[source]} • Factor: {ENERGY_FACTORS[source].factor} kg CO₂e/{unit}
        </p>
      </div>

      {/* Date */}
      <div>
        <label htmlFor="energy-date" className="block text-sm font-medium text-carbon-300 mb-2">
          Date
        </label>
        <input
          id="energy-date"
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
      {amountNum > 0 && (
        <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 animate-fade-in">
          <p className="text-sm text-emerald-400 font-medium">
            Estimated emission: <span className="text-lg font-bold">{preview.toFixed(2)}</span> kg CO₂e
          </p>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        disabled={amountNum <= 0}
        className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:bg-carbon-700 disabled:text-carbon-500
                   text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200
                   hover:shadow-lg hover:shadow-emerald-500/20 disabled:cursor-not-allowed"
      >
        Log Activity
      </button>
    </form>
  );
}
