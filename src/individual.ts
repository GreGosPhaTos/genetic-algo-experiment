import { createUT8Fitness } from './fitness/utf8-fitness';
import { compareBinaryString, stringToBinary } from './string.utils';
import { IndividualBuilder, UTF8Fitness } from './types';

export const UTF8IndividualBuilder = (
  target: Uint8Array
): IndividualBuilder<Uint8Array, Uint8Array, UTF8Fitness> => {
  return {
    build(gene: Uint8Array) {
      const diffs: number[] = Array.from(target).map((v, i) => {
        const diff = Math.abs(v - gene[i]);

        return 100 - (diff / 255) * 100;
      });

      return {
        getId: () => gene.toString(),
        getGene: () => gene,
        getScore: () => createUT8Fitness(diffs),
      };
    },
  };
};

export const binaryIndividualBuilder = (
  target: string
): IndividualBuilder<string, string> => {
  const targetBinary = stringToBinary(target);
  return {
    build(gene) {
      const score = Math.round(
        (compareBinaryString(targetBinary, gene) / targetBinary.length) * 100
      );

      return {
        getId: () => gene,
        getGene: () => gene,
        getScore: () => score,
      };
    },
  };
};
