import { Individual, Selector } from '../types';

export const rouletteWheel: Selector = {
  select(population, naturalSelection) {
    const individuals: Individual[] = population.getIndividuals();
    if (individuals.length === 0) throw new Error('Population is empty.');

    const totalFitness = individuals.reduce((acc, i) => acc + i.getScore(), 0);
    const newIndividuals: Individual[] = [];
    let lastInserted: string | null = null;
    const selectionCounts = new Map<string, number>();
    let remainingSelections = naturalSelection;

    while (remainingSelections > 0) {
      // Create a filtered array of eligible individuals
      const eligibleIndividuals = individuals.filter(
        (individual) => (selectionCounts.get(individual.getId()) || 0) < 3
      );

      // Check if there are eligible individuals left
      if (eligibleIndividuals.length === 0) {
        break;
      }

      let wheelPosition = Math.random() * totalFitness;

      for (let i = 0; i < individuals.length; i++) {
        if (newIndividuals.length >= naturalSelection) {
          return newIndividuals;
        }

        const individual = individuals[i];
        const individualId = individual.getId();

        // Skip if the previous inserted is the same parent
        if (
          newIndividuals.length > 0 &&
          newIndividuals[newIndividuals.length - 1].getId() === individualId
        ) {
          continue;
        }

        wheelPosition -= individual.getScore();

        if (wheelPosition <= 0) {
          newIndividuals.push(individual);
          selectionCounts.set(
            individualId,
            (selectionCounts.get(individualId) || 0) + 1
          );
          lastInserted = individualId;
          remainingSelections--;

          break;
        }
      }
    }

    return newIndividuals;
  },
};
