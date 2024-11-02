import { compareBinaryString, stringToBinary } from '../utils/string.utils';
import { IndividualBuilder } from '../types';
import { validation } from './validation';

function validateAndThrowError(target: unknown, gene: unknown) {
  if (!validation(gene, target)) {
    throw new Error(
      'Validation error: Gene length or type is incompatible with target.'
    );
  }
}

export const UTF8IndividualBuilder = (
  target: Uint8Array
): IndividualBuilder<Uint8Array> => {
  return {
    build(gene: Uint8Array) {
      validateAndThrowError(target, gene);
      const diffs: number[] = [];
      for (let i = 0; i < target.length; i++) {
        const diff = Math.abs(target[i] - gene[i]);
        // Similarity
        diffs.push(Number((100 - (diff / 255) * 100).toFixed(2)));
      }

      return {
        getId: () => gene.toString(),
        getGene: () => gene,
        getDivergences: () => diffs,
        getScore: () =>
          Number(
            (diffs.reduce((prev, v) => prev + v, 0) / diffs.length).toFixed(2)
          ),
      };
    },
  };
};

export const binaryIndividualBuilder = (
  target: string
): IndividualBuilder<string> => {
  const targetBinary = stringToBinary(target);
  return {
    build(gene: string) {
      validateAndThrowError(target, gene);

      const score = Math.round(
        (compareBinaryString(targetBinary, gene) / targetBinary.length) * 100
      );

      return {
        getId: () => gene,
        getGene: () => gene,
        getScore: () => score,
        getDivergences: () => null,
      };
    },
  };
};
