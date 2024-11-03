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

import { binarySinglePoint, UTF8fitnessBased } from './src/couplers/couplers';
import { Generation } from './src/generation/generation';
import { GenerationManager } from './src/generation/generation-manager';
import {
  binaryIndividualBuilder,
  UTF8IndividualBuilder,
} from './src/individuals/individual-builders';
import {
  binaryStringEncoderMutator,
  UTF8EncoderMutator,
} from './src/mutators/mutators';
import { getUserInputs } from './src/prompt/prompt';
import { rouletteWheel } from './src/selectors/selectors';
import { Coupler, IndividualBuilder, Mutator } from './src/types';

const utf8Encoder = new TextEncoder();

getUserInputs()
  .then((res) => {
    let iBuilder: IndividualBuilder;
    let coupler: Coupler;
    let mutator: Mutator;
    if (!res) {
      return;
    }

    if (res.strategy === 'binary') {
      // 1st experiment
      iBuilder = binaryIndividualBuilder(res.target);
      coupler = binarySinglePoint(iBuilder);
      mutator = binaryStringEncoderMutator(res.target, iBuilder);
    } else {
      // 2nd experiment
      const byteArray = utf8Encoder.encode(res.target);

      iBuilder = UTF8IndividualBuilder(byteArray);
      mutator = UTF8EncoderMutator(byteArray, iBuilder);
      coupler = UTF8fitnessBased(iBuilder);
    }

    const generationFactory = {
      build: (num: number) => {
        return new Generation(rouletteWheel, mutator, coupler, num);
      },
    };

    const start = new GenerationManager(
      generationFactory,
      res.generations,
      res.aimedScore
    );
    start.startGeneticAlgorythm(res.populationSize, res.naturalSelectionSize);
  })
  .finally(() => process.exit(0));
