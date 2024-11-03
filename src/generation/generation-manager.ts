import Population from '../population/population';
import { GenerationFactory } from '../types';

export class GenerationManager {
  private populationHistory: Population[];
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
      const generation = this.generationFactory.build(generations);
      const pop = generation.generatePopulation(
        maxNumberOfIndividual,
        naturalSelection,
        this.populationHistory.length
          ? this.populationHistory.slice(-1)[0]
          : undefined
      );

      this.populationHistory.push(pop);
      if (this.populationHistory.length > 20) {
        this.populationHistory = this.populationHistory.slice(-20);
      }

      const max = pop.isMaxFitnessThresoldReached(this.maxFitnessThresold);
      if (max) {
        var t = new TextDecoder();
        console.log(
          // utf8Encoder.encode(target),
          "Success we found the best canditate it's ",
          max?.getGene(),
          // binaryStringToUTF8String(max?.getGene()),
          t.decode(max?.getGene()),
          max?.getDivergences()
        );
        process.exit(0);
      }

      // Debug
      console.log(
        'Generation',
        generation.getGenerationNumber(),
        'Population total ',
        pop.getIndividuals().length,
        'Population scores ',
        pop.getFitness(),
        '   peaks ',
        pop.getPeaks()
        // process.memoryUsage()
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

        return acc;
      },
      0
    );

    if (regressions === ratio) {
      throw new Error('Regression detected');
    }
  }
}
