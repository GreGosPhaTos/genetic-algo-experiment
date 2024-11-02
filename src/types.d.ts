import { Generation } from '../main';
import Population from './population';

export type UTF8Fitness = {
  getFitness(): number;
  getDiffs(): number[];
};

export interface Individual<T = any, S = number> {
  getId: () => string;
  getScore: () => S;
  getGene: () => T;
}

export type IndividualBuilder<T = any, G = any, S = number> = {
  build(gene: G): Individual<T, S>;
};

export interface Coupler<T = any, S = number> {
  // Assuming individuals are ranked
  crossover: (
    parents: Individual<T, S>[],
    maxPopulation: number
  ) => Individual<T, S>[];
}

// Method called for generating the population of a first generation
export interface Mutator<T = any, S = number> {
  mutate(gene?: T): Individual<T, S>;
}

export interface GenerationFactory {
  build: () => Generation;
}

export interface Selector {
  select: (population: Population, naturalSelection: number) => Individual[];
}
