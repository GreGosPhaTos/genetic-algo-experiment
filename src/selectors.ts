import { Individual, Selector } from './types';

export const rouletteWheel: Selector = {
  select(population, naturalSelection) {
    const individuals = population.getIndividuals();
    if (individuals.length === 0) throw new Error('Population is empty.');

    const totalFitness = individuals.reduce((acc, i) => acc + i.getScore(), 0);
    const newIndividuals: Individual[] = [];
    const turnWheel = () => Math.random() * totalFitness;
    let wheelPosition = turnWheel();
    const inserted: string[] = [];
    for (let i = 0; i < individuals.length; i++) {
      if (newIndividuals.length >= naturalSelection) {
        break;
      }

      const individual = individuals[i];
      wheelPosition -= individual.getScore();
      if (wheelPosition <= 0) {
        // console.log({
        //   totalFitness,
        //   wheelPosition,
        //   id: individual.getId(),
        //   picked: individual.getGene(),
        //   sc: individual.getScore(),
        // });

        // if (inserted.includes(individual.getId())) {
        //   console.log('DOUBLONS');
        // }

        inserted.push(individual.getId());
        newIndividuals.push(individual);
        wheelPosition = turnWheel();
        i = 0;
      }
    }

    return newIndividuals;
  },
};
