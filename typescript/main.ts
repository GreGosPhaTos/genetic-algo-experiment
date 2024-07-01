interface Individual {
  getScore: () => number;
  setScore: (score: number) => void;
  getGene: <T>() => T;
  setGene: <T>(gene: T) => void;
}

interface Selector {
  select: (population: Population, naturalSelection: number) => Individual[];
}

interface Coupler {
  // Assuming individuals are ranked
  crossover: (parents: Individual[], maxPopulation: number) => Individual[];
}

// Method called for generating the population of a first generation
interface Mutator {
  mutate(): Individual;
}

abstract class Generation {
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
      const individuals = this.coupler.crossover(selected, naturalSelection);

      if (individuals.length > naturalSelection) {
        throw new Error(
          `Too much selected parents in this generation ${individuals.length} wanted ${naturalSelection} max`
        );
      }

      const mutatedIndividuals = [];
      for (let i = 0; i < maxNumberOfIndividual - naturalSelection; i++) {
        mutatedIndividuals.push(this.mutator.mutate());
      }

      return new Population([...individuals, ...mutatedIndividuals]);
    }

    const mutatedIndividuals = [];
    for (let i = 0; i < maxNumberOfIndividual; i++) {
      mutatedIndividuals.push(this.mutator.mutate());
    }

    return new Population(mutatedIndividuals);
  }

  public abstract scorePopulation(population: Population): Population;
}

class Population {
  private readonly individuals: Individual[];

  constructor(individuals: Individual[]) {
    this.individuals = individuals;
  }

  public getIndividuals() {
    return this.individuals;
  }

  public getFitness() {
    return this.individuals.reduce((acc, i) => acc + i.getScore(), 0);
  }

  public isFitnessThresoldReached(fitnessThresold: number) {
    return this.individuals.some((i) => i.getScore() >= fitnessThresold);
  }
}

class GenerationManager {
  private readonly previousPopulationsFitness: number[];
  private readonly maxNumberOfGeneration: number;
  private readonly fitnessThresold: number;
  private readonly populationNumberToThreshold: number;
  private readonly generationBuilder: { build: () => Generation };

  constructor(
    generationBuilder: { build: () => Generation },
    maxNumberOfGeneration: number,
    fitnessThresold: number,
    populationNumberToThreshold: number
  ) {
    this.generationBuilder = generationBuilder;
    this.fitnessThresold = fitnessThresold;
    this.maxNumberOfGeneration = maxNumberOfGeneration;
    this.populationNumberToThreshold = populationNumberToThreshold;
  }

  public startGeneticAlgorythm(
    maxNumberOfIndividual: number,
    // have to be less than the maxNumberOf Individuals
    naturalSelection: number
  ) {
    let prevPopulation: undefined | Population = undefined;
    for (
      let generations: number = 0;
      generations <= this.maxNumberOfGeneration;
      generations++
    ) {
      const generation = this.generationBuilder.build();
      const pop = generation.generatePopulation(
        maxNumberOfIndividual,
        naturalSelection,
        prevPopulation
      );
      prevPopulation = pop;
      if (pop.isFitnessThresoldReached(this.fitnessThresold)) {
        throw new Error('Fitness threshold reached');
      }
    }
  }
}
