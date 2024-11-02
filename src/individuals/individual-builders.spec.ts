import { describe, expect, it } from 'bun:test';
import {
  UTF8IndividualBuilder,
  binaryIndividualBuilder,
} from './individual-builders';
import { compareBinaryString, stringToBinary } from '../utils/string.utils';

describe('UTF8IndividualBuilder', () => {
  const target = new Uint8Array([100, 150, 200]);
  const utf8Builder = UTF8IndividualBuilder(target);

  it('should throw an error if gene and target are incompatible', () => {
    const incompatibleGene = new Uint8Array([100, 150]);

    expect(() => utf8Builder.build(incompatibleGene)).toThrow(
      'Validation error: Gene length or type is incompatible with target.'
    );
  });

  it('should calculate correct similarity score and divergences', () => {
    const gene = new Uint8Array([100, 140, 210]);
    const individual = utf8Builder.build(gene);

    // Expected similarity calculations for each byte:
    // Byte 1: (100 - 100) = 0 => similarity = 100 - (0/255 * 100) = 100
    // Byte 2: (150 - 140) = 10 => similarity = 100 - (10/255 * 100) ~ 96.08
    // Byte 3: (200 - 210) = 10 => similarity = 100 - (10/255 * 100) ~ 96.08

    expect(individual.getDivergences()).toEqual([
      100,
      96.08, // approximate value
      96.08, // approximate value
    ]);
    expect(individual.getScore()).toBeCloseTo(97.39, 2); // Average similarity
  });

  it('should return correct gene and id', () => {
    const gene = new Uint8Array([100, 140, 210]);
    const individual = utf8Builder.build(gene);

    expect(individual.getGene()).toEqual(gene);
    expect(individual.getId()).toBe(gene.toString());
  });
});

describe('binaryIndividualBuilder', () => {
  const target = 'ABC';
  const targetBinary = stringToBinary(target);
  const binaryBuilder = binaryIndividualBuilder(target);

  it('should throw an error if gene and target are incompatible', () => {
    const incompatibleGene = 'ABCD'; // Length mismatch

    expect(() => binaryBuilder.build(incompatibleGene)).toThrow(
      'Validation error: Gene length or type is incompatible with target.'
    );
  });

  it('should calculate correct similarity score for binary gene', () => {
    const gene = stringToBinary('ABD');
    const individual = binaryBuilder.build(gene);

    // Let's say we use compareBinaryString(targetBinary, gene) to calculate score.
    // Assuming compareBinaryString() calculates number of matching bits, we can expect
    // the score to be relative to how many bits match between 'ABC' and 'ABD'.

    const expectedScore = Math.round(
      (compareBinaryString(targetBinary, gene) / targetBinary.length) * 100
    );

    expect(individual.getScore()).toBe(expectedScore);
    // ToDO implement this
    expect(individual.getDivergences()).toBeNull();
  });

  it('should return correct gene and id', () => {
    const gene = stringToBinary('ABC');
    const individual = binaryBuilder.build(gene);

    expect(individual.getGene()).toBe(gene);
    expect(individual.getId()).toBe(gene);
  });
});
