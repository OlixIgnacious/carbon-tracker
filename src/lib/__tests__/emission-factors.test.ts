import { describe, it, expect } from 'vitest';
import { calculateTransportEmission, calculateFoodEmission, calculateEnergyEmission } from '../emission-factors';

describe('Emission Factors', () => {
  it('should calculate transport emissions correctly for petrol car', () => {
    // 10 km * 0.170 = 1.7
    expect(calculateTransportEmission('petrol_car', 10)).toBeCloseTo(1.7);
  });

  it('should calculate transport emissions correctly for bicycle (0 emissions)', () => {
    expect(calculateTransportEmission('bicycle', 100)).toBe(0);
  });

  it('should calculate energy emissions correctly for electricity', () => {
    // 10 kWh * 0.225 = 2.25
    expect(calculateEnergyEmission('electricity', 10)).toBeCloseTo(2.25);
  });

  it('should calculate food emissions correctly for beef', () => {
    // 0.25 kg * 27.0 = 6.75
    expect(calculateFoodEmission('beef', 0.25)).toBeCloseTo(6.75);
  });
});
