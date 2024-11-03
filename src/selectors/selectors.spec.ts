import { describe, expect, it, beforeEach } from 'bun:test';
import { rouletteWheel } from './selectors';

import { Individual } from '../types';
import Population from '../population/population';

// Mocking Math.random manually
const originalMathRandom = Math.random;

describe('RouletteWheel selector', () => {
  let population: Population;
  let individuals: Individual[];

  beforeEach(() => {
    Math.random = originalMathRandom;

    individuals = [
      {
        getScore: () => 30,
        getGene: () => 'A',
        getId: () => 'A',
        getDivergences: () => null,
      },
      {
        getScore: () => 20,
        getGene: () => 'B',
        getId: () => 'B',
        getDivergences: () => null,
      },
      {
        getScore: () => 50,
        getGene: () => 'C',
        getId: () => 'C',
        getDivergences: () => null,
      },
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

  it('selects individuals', () => {
    const selected = rouletteWheel.select(population, 3);
    expect(selected.length).toBe(3);
  });

  it('throws an error if the population is empty', () => {
    const emptyPopulation = new Population([]);
    expect(() => rouletteWheel.select(emptyPopulation, 1)).toThrow(
      'Population is empty.'
    );
  });

  it('selects individuals proportionally to their fitness scores', () => {
    Math.random = () => 0.7;
    const selected1 = rouletteWheel.select(population, 1);
    expect(selected1[0].getGene()).toBe('C'); // Should favor 'C'

    Math.random = () => 0.3;
    const selected2 = rouletteWheel.select(population, 1);
    expect(['A', 'B']).toContain(selected2[0].getGene()); // Should favor 'A' or 'B'
  });
});
