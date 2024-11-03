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
import { rouletteWheel } from './src/selectors/selectors';

const target = 'Hello';
const utf8Encoder = new TextEncoder();

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
  build: (num: number) => {
    return new Generation(rouletteWheel, utf8Mutator, utfCoupler, num);
  },
};

const start = new GenerationManager(generationFactory, 1000, 100);
start.startGeneticAlgorythm(5000, 5000);
