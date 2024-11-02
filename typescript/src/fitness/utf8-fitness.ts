import { UTF8Fitness } from '../types';

export function createUT8Fitness(byteArray: number[]): UTF8Fitness {
  const avg = byteArray.reduce((prev, v) => prev + v, 0) / byteArray.length;
  return Object.create({
    toString(): string {
      return String(avg);
    },

    valueOf(): number {
      return avg;
    },
    getDiffs(): number[] {
      return byteArray;
    },
    getFitness() {
      return avg;
    },
  });
}
