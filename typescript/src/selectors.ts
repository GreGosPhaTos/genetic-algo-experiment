import { Individual, Selector } from './types';

export const rouletteWheel: Selector = {
  select(population, naturalSelection) {
    const individuals = population.getIndividuals();
    if (individuals.length === 0) throw new Error('Population is empty.');

    const totalFitness = individuals.reduce((acc, i) => acc + i.getScore(), 0);
    const newIndividuals: Individual[] = [];
    let wheelPosition = Math.random() * totalFitness;

    for (let i = 0; i < naturalSelection; i++) {
      for (const individual of individuals) {
        wheelPosition -= individual.getScore();
        if (wheelPosition <= 0) {
          newIndividuals.push(individual);
          break;
        }
      }

      newIndividuals.push(individuals[individuals.length - 1]);
    }

    return newIndividuals;
  },
};
