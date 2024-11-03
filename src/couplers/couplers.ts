import { UTF8EncoderMutator } from '../mutators/mutators';
import { Coupler, Individual, IndividualBuilder, Mutator } from '../types';

export function UTF8fitnessBased(
  individualbuilder: IndividualBuilder<Uint8Array>
): Coupler {
  const mutator: Mutator = UTF8EncoderMutator(
    new Uint8Array(1),
    individualbuilder,
    1
  );

  return {
    crossover(parents: Individual[], maxPopulation: number): Individual[] {
      const offsprings = [];
      for (
        let i = 0;
        i < parents.length && offsprings.length < maxPopulation;
        i += 2
      ) {
        const parent1 = parents[i];
        const parent2 = parents[i + 1];
        if (!parent2) {
          continue;
        }

        if (parent2.getGene().length !== parent1.getGene().length) {
          throw new Error('Parents are incompatible');
        }

        const parent1Gene = parent1.getGene();
        const parent2Gene = parent2.getGene();
        // TODO fix all this
        const parent1Divergences = parent1.getDivergences() as number[];
        const parent2Divergences = parent2.getDivergences() as number[];
        const offspring = parent2Divergences.map((v, i) => {
          if (parent1Divergences[i] > v) {
            return parent1Gene[i];
          }

          return parent2Gene[i];
        });

        // console.log({
        //   parent1Gene,
        //   parent2Gene,
        //   parent1Divergences,
        //   parent2Divergences,
        //   offspring,
        // });

        offsprings.push(individualbuilder.build(new Uint8Array(offspring)));
        offsprings.push(mutator.mutate(i % 2 ? parent2Gene : parent1Gene));
      }

      return offsprings;
    },
  };
}

export function binarySinglePoint(
  individualbuilder: IndividualBuilder
): Coupler {
  return {
    crossover(parents: Individual[], maxPopulation: number): Individual[] {
      const offsprings: Individual[] = [];
      for (
        let i = 0;
        i < parents.length && offsprings.length < maxPopulation;
        i += 2
      ) {
        const parent1 = parents[i].getGene();
        const parent2 = parents[i + 1]?.getGene();

        if (!parent2) {
          continue;
        }

        const cut = Math.floor(Math.random() * parent1.length);
        const offspringGene1 = `${parent1.slice(0, cut)}${parent2.slice(cut)}`;
        const offspringGene2 = `${parent2.slice(0, cut)}${parent1.slice(cut)}`;

        if (parent1.length !== offspringGene1.length) {
          throw new Error(
            'offspringGene1 size is wrong parent1 ' +
              parent1 +
              ' parent2 ' +
              parent2 +
              ' offspring ' +
              offspringGene1 +
              ' i ' +
              i
          );
        }

        if (parent2.length !== offspringGene2.length) {
          throw new Error(
            'offspringGene2 size is wrong parent ' +
              parent2 +
              ' offspring ' +
              offspringGene2
          );
        }
        offsprings.push(individualbuilder.build(offspringGene1));
        if (offsprings.length < maxPopulation) {
          offsprings.push(individualbuilder.build(offspringGene2));
        }
      }
      return offsprings;
    },
  };
}
