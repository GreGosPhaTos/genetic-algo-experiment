import { describe, expect, it, beforeEach } from 'bun:test';
import createBtree from './btree';

describe('Btree Implementation', () => {
  let tree: ReturnType<typeof createBtree<string>>;

  beforeEach(() => {
    tree = createBtree<string>();
  });

  it('should initialize and insert a single node', () => {
    const result = tree.insert('value1', 10);
    expect(result).toEqual({
      index: 10,
      values: ['value1'],
    });
  });

  it('should insert multiple nodes and maintain correct structure', () => {
    tree.insert('value1', 10);
    tree.insert('value2', 5);
    tree.insert('value3', 15);

    const result = tree.insert('value4', 20);
    expect(result).toEqual({
      index: 10,
      values: ['value1'],
      left: { index: 5, values: ['value2'] },
      right: {
        index: 15,
        values: ['value3'],
        right: { index: 20, values: ['value4'] },
      },
    });
  });

  it('should find the closest node correctly', () => {
    tree.insert('value1', 10);
    tree.insert('value2', 5);
    tree.insert('value3', 15);

    const closest = tree.searchAndFindClosest(8);
    expect(closest).toEqual({
      index: 10,
      values: ['value1'],
    });
  });

  it('should handle searching in an empty tree', () => {
    expect(() => tree.searchAndFindClosest(10)).toThrow();
  });
});
