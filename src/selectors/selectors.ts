import { Individual, Selector } from '../types';

export const rouletteWheel: Selector = {
  select(population, naturalSelection) {
    const individuals = population.getIndividuals();
    if (individuals.length === 0) throw new Error('Population is empty.');

    const totalFitness = individuals.reduce((acc, i) => acc + i.getScore(), 0);
    const newIndividuals: Individual[] = [];
    const inserted: string[] = [];
    let remainingSelections = naturalSelection;

    while (remainingSelections > 0) {
      let wheelPosition = Math.random() * totalFitness;
      for (let i = 0; i < individuals.length; i++) {
        if (newIndividuals.length >= naturalSelection) {
          return newIndividuals;
        }

        const individual = individuals[i];
        wheelPosition -= individual.getScore();
        if (wheelPosition <= 0) {
          inserted.push(individual.getId());
          newIndividuals.push(individual);
          remainingSelections--;
        }
      }
    }

    return newIndividuals;
  },
};
