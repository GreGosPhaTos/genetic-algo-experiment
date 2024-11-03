import { Individual } from '../types';

export default class Population {
  private readonly individuals: Individual[];

  constructor(individuals: Individual[]) {
    this.individuals = individuals;
  }

  public getIndividuals() {
    return this.individuals;
  }

  public getFitness() {
    const total = this.individuals.reduce((acc, i) => acc + i.getScore(), 0);
    // AVG
    return total / this.individuals.length;
  }

  public getPeaks(): [number, number] {
    let max = 0;
    let min = Number.MAX_SAFE_INTEGER;
    this.individuals.forEach((v) => {
      if (v.getScore() + 0 > max) {
        max = v.getScore() + 0;
      }

      if (v.getScore() + 0 < min) {
        min = v.getScore() + 0;
      }
    });
    return [max, min];
  }

  public isMaxFitnessThresoldReached(maxFitnessThresold: number) {
    return this.individuals.find((i) => i.getScore() >= maxFitnessThresold);
  }
}
