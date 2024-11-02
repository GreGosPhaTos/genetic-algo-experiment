import { describe, expect, it } from 'bun:test';
import { validation } from './validation';

describe('validation function', () => {
  it('should return true for strings of the same length', () => {
    expect(validation('hello', 'world')).toBe(true);
    expect(validation('', '')).toBe(true);
    expect(validation('test', 'four')).toBe(true);
  });

  it('should return false for strings of different lengths', () => {
    expect(validation('hello', 'world!')).toBe(false);
    expect(validation('short', 'longer string')).toBe(false);
  });

  it('should return true for number arrays of the same length', () => {
    expect(validation([1, 2, 3], [4, 5, 6])).toBe(true);
    expect(validation([], [])).toBe(true);
  });

  it('should return false for number arrays of different lengths', () => {
    expect(validation([1, 2, 3], [1, 2])).toBe(false);
    expect(validation([1], [1, 2, 3])).toBe(false);
  });

  it('should return true for Uint8Arrays of the same length', () => {
    expect(
      validation(new Uint8Array([1, 2, 3]), new Uint8Array([4, 5, 6]))
    ).toBe(true);
    expect(validation(new Uint8Array([]), new Uint8Array([]))).toBe(true);
  });

  it('should return false for Uint8Arrays of different lengths', () => {
    expect(validation(new Uint8Array([1, 2]), new Uint8Array([1, 2, 3]))).toBe(
      false
    );
    expect(validation(new Uint8Array([1, 2, 3]), new Uint8Array([1]))).toBe(
      false
    );
  });

  it('should return true for numbers', () => {
    expect(validation(10, 10)).toBe(true);
    expect(validation(10, 100)).toBe(true);
    expect(validation(0, 0)).toBe(true);
  });

  it('should return false for different types', () => {
    expect(validation('string' as unknown as number, 123)).toBe(false);
    expect(
      validation([1, 2, 3] as unknown as Uint8Array, new Uint8Array([1, 2, 3]))
    ).toBe(false);
    expect(
      validation('test' as unknown as Uint8Array, new Uint8Array([1, 2, 3]))
    ).toBe(false);
    expect(validation(10 as unknown as string, '10')).toBe(false);
  });
});
