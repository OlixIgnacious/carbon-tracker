// ============================================================
// Emission Factors & Calculation Engine
// Sources:
//   - Transport & Energy: UK DEFRA/DESNZ GHG Conversion Factors 2024
//   - Food: Poore & Nemecek (2018), Science, DOI: 10.1126/science.aaq0216
// All values in kg CO₂e (carbon dioxide equivalent)
// ============================================================

import type { TransportMode, EnergySource, FoodCategory } from './types';

// --- Transport: kg CO₂e per passenger-km ---
export const TRANSPORT_FACTORS: Record<TransportMode, number> = {
  petrol_car: 0.17,
  diesel_car: 0.17,
  electric_car: 0.04,
  motorcycle: 0.11,
  bus: 0.10,
  train: 0.04,
  short_haul_flight: 0.13,
  long_haul_flight: 0.11,
  bicycle: 0.0,
  walking: 0.0,
};

// --- Energy: kg CO₂e per unit ---
export const ENERGY_FACTORS: Record<EnergySource, { factor: number; unit: string }> = {
  electricity: { factor: 0.225, unit: 'kWh' },   // UK grid average 2024
  natural_gas: { factor: 0.183, unit: 'kWh' },   // DEFRA 2024
  water: { factor: 0.421, unit: 'm³' },           // Supply (0.149) + Treatment (0.272)
};

// --- Food: kg CO₂e per kg of food (cradle-to-retail) ---
export const FOOD_FACTORS: Record<FoodCategory, number> = {
  beef: 27.0,
  lamb: 24.0,
  cheese: 13.5,
  pork: 7.6,
  chicken: 6.9,
  fish: 6.0,
  eggs: 4.7,
  rice: 4.0,
  milk: 3.2,
  vegetables: 2.0,
  fruits: 1.1,
  legumes: 0.9,
};

// --- Reference Values ---
export const UK_AVERAGE_DAILY_CO2E = 13.0; // kg CO₂e per person per day (approximate)
export const TREES_PER_KG_CO2E_YEAR = 1 / 22; // One mature tree absorbs ~22 kg CO₂/year

// --- Calculation Functions ---

export function calculateTransportEmission(mode: TransportMode, distanceKm: number): number {
  if (distanceKm < 0) return 0;
  return Math.round(TRANSPORT_FACTORS[mode] * distanceKm * 1000) / 1000;
}

export function calculateEnergyEmission(source: EnergySource, amount: number): number {
  if (amount < 0) return 0;
  return Math.round(ENERGY_FACTORS[source].factor * amount * 1000) / 1000;
}

export function calculateFoodEmission(category: FoodCategory, weightKg: number): number {
  if (weightKg < 0) return 0;
  return Math.round(FOOD_FACTORS[category] * weightKg * 1000) / 1000;
}

// --- Display Helpers ---

export const TRANSPORT_LABELS: Record<TransportMode, string> = {
  petrol_car: 'Petrol Car',
  diesel_car: 'Diesel Car',
  electric_car: 'Electric Car',
  motorcycle: 'Motorcycle',
  bus: 'Bus',
  train: 'Train',
  short_haul_flight: 'Short-haul Flight',
  long_haul_flight: 'Long-haul Flight',
  bicycle: 'Bicycle',
  walking: 'Walking',
};

export const ENERGY_LABELS: Record<EnergySource, string> = {
  electricity: 'Electricity',
  natural_gas: 'Natural Gas',
  water: 'Water',
};

export const FOOD_LABELS: Record<FoodCategory, string> = {
  beef: 'Beef',
  lamb: 'Lamb',
  cheese: 'Cheese',
  pork: 'Pork',
  chicken: 'Chicken',
  fish: 'Fish',
  eggs: 'Eggs',
  rice: 'Rice',
  milk: 'Milk',
  vegetables: 'Vegetables',
  fruits: 'Fruits',
  legumes: 'Legumes',
};

export const TRANSPORT_ICONS: Record<TransportMode, string> = {
  petrol_car: '🚗',
  diesel_car: '🚙',
  electric_car: '⚡',
  motorcycle: '🏍️',
  bus: '🚌',
  train: '🚆',
  short_haul_flight: '✈️',
  long_haul_flight: '🛫',
  bicycle: '🚲',
  walking: '🚶',
};

export const ENERGY_ICONS: Record<EnergySource, string> = {
  electricity: '💡',
  natural_gas: '🔥',
  water: '💧',
};

export const FOOD_ICONS: Record<FoodCategory, string> = {
  beef: '🥩',
  lamb: '🍖',
  cheese: '🧀',
  pork: '🥓',
  chicken: '🍗',
  fish: '🐟',
  eggs: '🥚',
  rice: '🍚',
  milk: '🥛',
  vegetables: '🥬',
  fruits: '🍎',
  legumes: '🫘',
};

/**
 * Generate a relatable narrative for a given CO₂e amount.
 */
export function getNarrative(kgCO2e: number): string {
  if (kgCO2e <= 0) return 'No emissions recorded';
  if (kgCO2e < 1) return `Equivalent to driving ${(kgCO2e / 0.17).toFixed(1)} km in a petrol car`;
  if (kgCO2e < 5) return `Equivalent to charging ${(kgCO2e / 0.225 / 8).toFixed(0)} smartphones for a year`;
  if (kgCO2e < 20) return `Needs ${(kgCO2e * 365 / 22).toFixed(0)} trees to offset annually`;
  return `Equivalent to a ${(kgCO2e / 0.11 / 1000).toFixed(1)}k km long-haul flight`;
}
