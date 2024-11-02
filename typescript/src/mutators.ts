import { randomString, stringToBinary } from './string.utils';
import { Individual, IndividualBuilder, Mutator, UTF8Fitness } from './types';

export function UTF8EncoderMutator(
  target: Uint8Array,
  individualBuilder: IndividualBuilder<Uint8Array, Uint8Array, UTF8Fitness>,
  mutationProbability = 0.01,
  mutationBytesVariation = 0.05
): Mutator<Uint8Array, UTF8Fitness> {
  return {
    mutate(gene?: Uint8Array) {
      let mutatedGene: Uint8Array;
      if (!gene) {
        mutatedGene = target.map(() => Math.round(Math.random() * 255));
      } else {
        mutatedGene = gene.map((bytes) => {
          if (Math.random() < mutationProbability) {
            const variation = bytes * mutationBytesVariation;
            if (variation + bytes > 255) {
              return bytes - variation;
            }

            if (bytes - variation < 0) {
              return bytes + variation;
            }

            return bytes % 2 ? bytes + variation : bytes - variation;
          }

          return bytes;
        });
      }

      if (!mutatedGene) {
        throw new Error('empty mutated gene ' + gene);
      }

      return individualBuilder.build(mutatedGene);
    },
  };
}

export function binaryStringEncoderMutator(
  target: string,
  individualBuilder: IndividualBuilder,
  mutationProbability = 0.01
): Mutator<string> {
  const targetBinary = stringToBinary(target);
  return {
    mutate(gene): Individual<string> {
      let mutatedGene;
      if (!gene) {
        mutatedGene = randomString(targetBinary.length);
      } else {
        mutatedGene = Array.from(gene)
          .map((bit) => {
            // Flip each bit with a small mutation probability
            if (Math.random() < mutationProbability) {
              return bit === '0' ? '1' : '0';
            }
            return bit;
          })
          .join('');
      }

      if (!mutatedGene) {
        throw new Error('empty mutated gene ' + gene);
      }

      return individualBuilder.build(mutatedGene);
    },
  };
}
