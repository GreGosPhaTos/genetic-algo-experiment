import { Generation } from '../main';
import Population from './population';

export type UTF8Fitness = {
  getFitness(): number;
  getDiffs(): number[];
};

export interface Individual<T = any> {
  getId: () => string;
  getScore: () => number;
  getGene: () => T;
  getDivergences: () => any;
}

export type IndividualBuilder<T = any> = {
  build(gene: T): Individual<T>;
};

export interface Coupler<T = any> {
  crossover: (
    parents: Individual<T>[],
    maxPopulation: number
  ) => Individual<T, S>[];
}

export interface Mutator<T = any> {
  mutate(gene?: T): Individual<T>;
}

export interface GenerationFactory {
  build: (num: number) => Generation;
}

export interface Selector {
  select: (population: Population, naturalSelection: number) => Individual[];
}
