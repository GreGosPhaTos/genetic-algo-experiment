type Btree<T = any> = {
  left?: Btree<T>;
  right?: Btree<T>;
  index: number;
  values: T[];
};

export default function <T>() {
  let tree: Btree<T> | null = null;

  function insert(node: Btree<T>, value: T, index: number): void {
    if (node.index > index) {
      if (!node.left) {
        node.left = { values: [value], index };
        return;
      }
      return insert(node.left, value, index);
    } else if (node.index < index) {
      if (!node.right) {
        node.right = { values: [value], index };
        return;
      }
      return insert(node.right, value, index);
    } else {
      node.values.push(value); // Same index, append value.
    }
  }

  function traverseAndFindClosest(
    node: Btree<T>,
    index: number
  ): Btree<T> | null {
    if (!node) return null;

    if (node.index === index) {
      return node;
    }

    if (node.index < index) {
      return node.right ? traverseAndFindClosest(node.right, index) : node;
    } else if (node.index > index) {
      return node.left && node.left.index > index
        ? traverseAndFindClosest(node.left, index)
        : { values: node.values, index: node.index };
    }

    return node;
  }

  return {
    insert(value: T, index: number | string): Btree<T> {
      index = parseFloat(`${index}`);

      if (!tree) {
        tree = { values: [value], index };
      } else {
        insert(tree, value, index);
      }

      return tree;
    },

    searchAndFindClosest(index: number | string): Btree<T> | null {
      index = parseInt(`${index}`, 10);
      if (!tree) throw new Error('Tree is empty');
      return traverseAndFindClosest(tree, index);
    },

    values() {
      const values: { [key: string]: unknown } = {};
      const traverse = (node: Btree) => {
        values[node.index] = { i: node.index, count: node.values.length };
        if (!node?.left && !node?.right) return;
        traverse(node?.left ? node.left : (node.right as Btree));
      };
      traverse(tree as Btree);
      return values;
    },
  };
}
