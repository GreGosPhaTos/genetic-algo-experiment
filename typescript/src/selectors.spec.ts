import { describe, expect, it, beforeEach } from 'bun:test';
import { rouletteWheel } from './selectors';

import { Individual } from './types';
import Population from './population';

// Mocking Math.random manually
const originalMathRandom = Math.random;

describe('RouletteWheel selector', () => {
  let population: Population;
  let individuals: Individual[];

  beforeEach(() => {
    // Reset Math.random to its original implementation before each test
    Math.random = originalMathRandom;

    individuals = [
      { getScore: () => 30, getGene: () => 'A', getId: () => 'A' },
      { getScore: () => 20, getGene: () => 'B', getId: () => 'B' },
      { getScore: () => 50, getGene: () => 'C', getId: () => 'C' },
    ];

    population = new Population(individuals);
  });

  it('selects individuals based on their relative fitness', () => {
    const selected = rouletteWheel.select(population, 2);
    expect(selected.length).toBe(2);
    const selectedGenes = selected.map((ind) => ind.getGene());
    selectedGenes.forEach((gene) => {
      expect(['A', 'B', 'C']).toContain(gene);
    });
  });

  it('selects unique individuals (no duplicates)', () => {
    const selected = rouletteWheel.select(population, 3);
    expect(selected.length).toBe(3);
    const uniqueSelectedIds = new Set(selected.map((ind) => ind.getId()));
    expect(uniqueSelectedIds.size).toBe(3);
  });

  it('throws an error if the population is empty', () => {
    const emptyPopulation = new Population([]);
    expect(() => rouletteWheel.select(emptyPopulation, 1)).toThrow(
      'Population is empty.'
    );
  });

  it('selects individuals proportionally to their fitness scores', () => {
    // Mock Math.random to simulate specific values
    Math.random = () => 0.7;
    const selected1 = rouletteWheel.select(population, 1);
    expect(selected1[0].getGene()).toBe('C'); // Should favor 'C'

    Math.random = () => 0.3;
    const selected2 = rouletteWheel.select(population, 1);
    expect(['A', 'B']).toContain(selected2[0].getGene()); // Should favor 'A' or 'B'
  });
});
