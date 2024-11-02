// https://medium.com/geekculture/genetic-algorithm-a-simple-example-161d788f0465
/**
  Step 1- Choose an encoding technique, a selection operator, and a crossover operator
  Step 2- Choose a population size
  Step 3- Randomly choose the initial population
  xStep 4- Select parental chromosomes
  Step 5- Perform Crossover (random crossover points)
  Step 6- Evaluation of offsprings
  Step 7- Repeat the process

  Step 1-
    Encoding technique- Binary encoding
    Selection operator- Roulette Wheel Selection
    Crossover operator- Single point crossover


TODO se renseigner sur les workers

*/

import { binarySinglePoint, UTF8fitnessBased } from './src/couplers';
import {
  binaryIndividualBuilder,
  UTF8IndividualBuilder,
} from './src/individual';
import { binaryStringEncoderMutator, UTF8EncoderMutator } from './src/mutators';
import Population from './src/population';
import { rouletteWheel } from './src/selectors';
import { binaryStringToUTF8String, stringToBinary } from './src/string.utils';
import { Coupler, GenerationFactory, Mutator, Selector } from './src/types';

const target = 'Hel';

const utf8Encoder = new TextEncoder();

export class Generation {
  private readonly selector: Selector;
  private readonly coupler: Coupler;
  private readonly generationNumber: number;
  private readonly mutator: Mutator;

  constructor(
    selector: Selector,
    mutator: Mutator<any, any>,
    coupler: Coupler<any, any>,
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

      // console.log('selected', selected.length);
      // console.log(
      //   'selected',
      //   selected.map((v) => ({ s: v.getId(), score: v.getScore() }))
      // );

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

  // public abstract score(population: Population): Population;
}

class GenerationManager {
  private readonly populationHistory: Population[];
  private readonly maxNumberOfGeneration: number;
  private readonly maxFitnessThresold: number;
  private readonly generationFactory: GenerationFactory;

  constructor(
    generationFactory: GenerationFactory,
    maxNumberOfGeneration: number,
    maxFitnessThresold: number
  ) {
    this.generationFactory = generationFactory;
    this.maxFitnessThresold = maxFitnessThresold;
    this.maxNumberOfGeneration = maxNumberOfGeneration;
    this.populationHistory = [];
  }

  public startGeneticAlgorythm(
    maxNumberOfIndividual: number,
    // have to be less than the maxNumberOf Individuals
    naturalSelection: number
  ) {
    for (
      let generations: number = 0;
      generations <= this.maxNumberOfGeneration;
      generations++
    ) {
      const generation = this.generationFactory.build();
      const pop = generation.generatePopulation(
        maxNumberOfIndividual,
        naturalSelection,
        this.populationHistory.length
          ? this.populationHistory.slice(-1)[0]
          : undefined
      );

      this.populationHistory.push(pop);
      const max = pop.isMaxFitnessThresoldReached(this.maxFitnessThresold);
      if (max) {
        var t = new TextDecoder();
        console.log(
          utf8Encoder.encode(target),
          "Success we found the best canditate it's ",
          max?.getGene(),
          // binaryStringToUTF8String(max?.getGene()),
          t.decode(max?.getGene()),
          (max?.getScore() as any).getDiffs()
        );
        process.exit(0);
      }

      // Debug
      console.log(
        'Population scores ',
        pop.getFitness(),
        '   peaks ',
        pop.getPeaks(),
        process.memoryUsage()
      );
      // let cpt = 0;
      // for (const [i, v] of pop.getIndividuals().entries()) {
      //   cpt++;
      //   console.log(
      //     'Individuals',
      //     i,
      //     'score',
      //     v.getScore(),
      //     '/',
      //     target.length * 8
      //   );
      //   console.log('GeneA', stringToBinary(target));
      //   console.log('GeneB', v.getGene());
      //   console.log('Gene', binaryStringToUTF8String(v.getGene()));
      // }
      // End
      this.calculateRegression();
    }
  }

  private calculateRegression() {
    const ratio = Math.round(this.maxNumberOfGeneration * 0.2);
    if (this.populationHistory.length < ratio) {
      return;
    }

    const regressions = this.populationHistory.reduce(
      (acc, val, index, array) => {
        if (index === 0) {
          return acc;
        }

        if (val.getFitness() < array[index - 1].getFitness()) {
          return acc + 1;
        }

        return acc - 1;
      },
      0
    );

    if (regressions === ratio) {
      throw new Error('Regression detected');
    }
  }
}
// 1st experiment
const iBuilder = binaryIndividualBuilder(target);
const coupler = binarySinglePoint(iBuilder);
const mutator = binaryStringEncoderMutator(target, iBuilder);
// 2nd experiment // Crée un encodeur UTF-8
const byteArray = utf8Encoder.encode(target);

const utf8IBuilder = UTF8IndividualBuilder(byteArray);
const utf8Mutator = UTF8EncoderMutator(byteArray, utf8IBuilder);
const utfCoupler = UTF8fitnessBased(utf8IBuilder);

const generationFactory = {
  build: () => {
    return new Generation(rouletteWheel, utf8Mutator, utfCoupler, 3);
  },
};

const start = new GenerationManager(generationFactory, 1000, 99);
start.startGeneticAlgorythm(1000, 800);
