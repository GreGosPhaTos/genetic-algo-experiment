export function validation(gene: string, target: string): boolean;
export function validation(gene: number, target: number): boolean;
export function validation(gene: number[], target: number[]): boolean;
export function validation(gene: Uint8Array, target: Uint8Array): boolean;
export function validation(gene: unknown, target: unknown): boolean;

export function validation(gene: unknown, target: unknown): boolean {
  if (typeof gene !== typeof target) return false;

  switch (typeof target) {
    case 'number':
      return true;

    case 'string':
      return (gene as string).length === target.length;

    case 'object':
      if (Array.isArray(gene)) {
        return Array.isArray(target) && target.length === gene.length;
      }

      if (gene instanceof Uint8Array) {
        return target instanceof Uint8Array && target.length === gene.length;
      }
      break;
  }

  return false;
}
