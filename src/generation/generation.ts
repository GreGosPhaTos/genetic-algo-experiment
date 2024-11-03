import Population from '../population/population';
import { Coupler, Mutator, Selector } from '../types';

export class Generation {
  private readonly selector: Selector;
  private readonly coupler: Coupler;
  private readonly generationNumber: number;
  private readonly mutator: Mutator;

  constructor(
    selector: Selector,
    mutator: Mutator,
    coupler: Coupler,
    generationNumber: number
  ) {
    this.selector = selector;
    this.coupler = coupler;
    this.mutator = mutator;
    this.generationNumber = generationNumber;
  }

  public getGenerationNumber(): number {
    return this.generationNumber;
  }

  public generatePopulation(
    maxNumberOfIndividual: number,
    // have to be less than the maxNumberOf Individuals
    naturalSelection: number,
    previousPopulation?: Population
  ): Population {
    if (naturalSelection > maxNumberOfIndividual) {
      throw new Error(
        `Natural selection is too high ${naturalSelection} it should less than the maxNumberOfIndividual`
      );
    }

    if (previousPopulation) {
      const selected = this.selector.select(
        previousPopulation,
        naturalSelection
      );

      const selectedIndividuals = this.coupler.crossover(
        selected,
        naturalSelection
      );

      if (selectedIndividuals.length > naturalSelection) {
        throw new Error(
          `Too much selected parents in this generation ${naturalSelection} wanted, but got ${selectedIndividuals.length}`
        );
      }

      // Mutate only a portion of individuals, e.g., 50% of the offspring
      const mutatedIndividuals = selectedIndividuals.map((individual) => {
        return Math.random() < 0.5
          ? this.mutator.mutate(individual.getGene())
          : individual;
      });

      // Create new Individuals
      if (mutatedIndividuals.length < maxNumberOfIndividual) {
        const newIndividuals =
          maxNumberOfIndividual - mutatedIndividuals.length;
        for (let i = 0; i < newIndividuals; i++) {
          mutatedIndividuals.push(this.mutator.mutate());
        }
      }

      return new Population(mutatedIndividuals);
    }

    const mutatedIndividuals = [];
    for (let i = 0; i < maxNumberOfIndividual; i++) {
      mutatedIndividuals.push(this.mutator.mutate());
    }

    return new Population(mutatedIndividuals);
  }
}
