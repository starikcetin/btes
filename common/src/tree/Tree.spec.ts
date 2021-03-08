import { Tree } from './Tree';
import { TreeNode } from './TreeNode';

interface NodeDataType {
  a: number;
  b: string;
}

const data: NodeDataType = {
  a: 1,
  b: 'foobar',
};

function makeComplexTree(): Tree<NodeDataType> {
  /*
   *                 c1 -> c2 -> c3
   *                /
   *         b1 -> b2 -> b3
   *        /
   * a1 -> a2 -> a3 -> a4 -> a5 -> a6
   *              \
   *               d1 -> d2 -> d3
   *                \
   *                 e1 -> e2 -> e3
   */

  const tree = new Tree<NodeDataType>();

  tree.createNode('a1', data, null);
  tree.createNode('a2', data, 'a1');
  tree.createNode('a3', data, 'a2');
  tree.createNode('a4', data, 'a3');
  tree.createNode('a5', data, 'a4');
  tree.createNode('a6', data, 'a5');

  tree.createNode('b1', data, 'a2');
  tree.createNode('b2', data, 'b1');
  tree.createNode('b3', data, 'b2');

  tree.createNode('c1', data, 'b2');
  tree.createNode('c2', data, 'c1');
  tree.createNode('c3', data, 'c2');

  tree.createNode('d1', data, 'a3');
  tree.createNode('d2', data, 'd1');
  tree.createNode('d3', data, 'd2');

  tree.createNode('e1', data, 'd1');
  tree.createNode('e2', data, 'e1');
  tree.createNode('e3', data, 'e2');

  return tree;
}

it('returns uniq nodes', () => {
  const nodeA = new TreeNode<NodeDataType>('nodeA', data);
  const nodeB = new TreeNode<NodeDataType>('nodeB', data);
  const nodeC = new TreeNode<NodeDataType>('nodeC', data);

  const r1 = Tree.uniq([nodeA, nodeB, nodeC]);
  expect(r1).toHaveLength(3);
  expect(r1).toContain(nodeA);
  expect(r1).toContain(nodeB);
  expect(r1).toContain(nodeC);

  const r2 = Tree.uniq([nodeA, nodeA, nodeA]);
  expect(r2).toHaveLength(1);
  expect(r2).toContain(nodeA);

  const r3 = Tree.uniq([]);
  expect(r3).toHaveLength(0);

  const r4 = Tree.uniq([nodeA, nodeA, nodeB, nodeB, nodeC, nodeC]);
  expect(r4).toHaveLength(3);
  expect(r4).toContain(nodeA);
  expect(r4).toContain(nodeB);
  expect(r4).toContain(nodeC);
});

it('has correct empty state', () => {
  const tree = new Tree<NodeDataType>();
  const outsiderNode = new TreeNode<NodeDataType>('node-id', data);

  expect(tree.forkPoints).toHaveLength(0);
  expect(tree.heads).toHaveLength(0);
  expect(tree.root).toBeNull();
  expect(tree.getNode(outsiderNode.id)).toBeNull();
  expect(() => tree.getForkPointOrRoot(outsiderNode)).toThrow();
  expect(tree.isHeadNode(outsiderNode.id)).toBe(false);
  expect(tree.isRootNode(outsiderNode.id)).toBe(false);
  expect(tree.isForkPoint(outsiderNode.id)).toBe(false);
});

it('creates root node', () => {
  const tree = new Tree<NodeDataType>();
  const rootNode = tree.createNode('root-node', data, null);

  expect(tree.forkPoints).toHaveLength(0);
  expect(tree.heads).toHaveLength(1);
  expect(tree.root).toBe(rootNode);
  expect(tree.getNode(rootNode.id)).toBe(rootNode);
  expect(tree.getForkPointOrRoot(rootNode)).toBe(rootNode);
  expect(tree.isHeadNode(rootNode.id)).toBe(true);
  expect(tree.isRootNode(rootNode.id)).toBe(true);
  expect(tree.isForkPoint(rootNode.id)).toBe(false);

  expect(rootNode.parent).toBeNull();
  expect(rootNode.hasParent).toBe(false);
  expect(rootNode.children).toHaveLength(0);
});

it('adds root node', () => {
  const tree = new Tree<NodeDataType>();
  const rootNode = new TreeNode<NodeDataType>('root-node', data);
  tree.addNode(rootNode, null);

  expect(tree.forkPoints).toHaveLength(0);
  expect(tree.heads).toHaveLength(1);
  expect(tree.root).toBe(rootNode);
  expect(tree.getNode(rootNode.id)).toBe(rootNode);
  expect(tree.getForkPointOrRoot(rootNode)).toBe(rootNode);
  expect(tree.isHeadNode(rootNode.id)).toBe(true);
  expect(tree.isRootNode(rootNode.id)).toBe(true);
  expect(tree.isForkPoint(rootNode.id)).toBe(false);

  expect(rootNode.parent).toBeNull();
  expect(rootNode.hasParent).toBe(false);
  expect(rootNode.children).toHaveLength(0);
});

it('gets node', () => {
  const tree = makeComplexTree();

  const findAndAssertId = (nodeId: string) => {
    const foundNode = tree.getNode(nodeId);

    expect(foundNode).not.toBeNull();
    expect(foundNode?.id).toBe(nodeId);
  };

  [
    'a1',
    'a2',
    'a3',
    'a4',
    'a5',
    'a6',
    'b1',
    'b2',
    'b3',
    'c1',
    'c2',
    'c3',
    'd1',
    'd2',
    'd3',
    'e1',
    'e2',
    'e3',
  ].forEach(findAndAssertId);

  const notExistingNode = tree.getNode('foobar');
  expect(notExistingNode).toBeNull();
});

it('registers fork points', () => {
  /*
   *                 c1 -> c2 -> c3
   *                /
   *         b1 -> b2 -> b3
   *        /
   * a1 -> a2 -> a3 -> a4 -> a5 -> a6
   *              \
   *               d1 -> d2 -> d3
   *                \
   *                 e1 -> e2 -> e3
   */

  const tree = makeComplexTree();
  const forkPointIds = tree.forkPoints.map((n) => n.id);

  expect(forkPointIds).toHaveLength(4);
  expect(forkPointIds).toContain('a2');
  expect(forkPointIds).toContain('b2');
  expect(forkPointIds).toContain('a3');
  expect(forkPointIds).toContain('d1');

  expect(tree.isForkPoint('a2')).toBe(true);
  expect(tree.isForkPoint('b2')).toBe(true);
  expect(tree.isForkPoint('a3')).toBe(true);
  expect(tree.isForkPoint('d1')).toBe(true);

  expect(tree.isForkPoint('a1')).toBe(false);
});

it('registers root', () => {
  const tree = makeComplexTree();

  expect(tree.root).not.toBeNull();

  if (tree.root === null) {
    throw new Error('tree root should not be null here');
  }

  expect(tree.root.id).toBe('a1');
  expect(tree.isRootNode(tree.root.id)).toBe(true);
  expect(tree.isRootNode('a2')).toBe(false);
});

it('registers heads', () => {
  /*
   *                 c1 -> c2 -> c3
   *                /
   *         b1 -> b2 -> b3
   *        /
   * a1 -> a2 -> a3 -> a4 -> a5 -> a6
   *              \
   *               d1 -> d2 -> d3
   *                \
   *                 e1 -> e2 -> e3
   */

  const tree = makeComplexTree();
  const headIds = tree.heads.map((n) => n.id);

  expect(headIds).toHaveLength(5);
  expect(headIds).toContain('c3');
  expect(headIds).toContain('b3');
  expect(headIds).toContain('a6');
  expect(headIds).toContain('d3');
  expect(headIds).toContain('e3');

  expect(tree.isHeadNode('c3')).toBe(true);
  expect(tree.isHeadNode('b3')).toBe(true);
  expect(tree.isHeadNode('a6')).toBe(true);
  expect(tree.isHeadNode('d3')).toBe(true);
  expect(tree.isHeadNode('e3')).toBe(true);

  expect(tree.isHeadNode('a1')).toBe(false);
});

it('finds root or fork points', () => {
  /*
   *                 c1 -> c2 -> c3
   *                /
   *         b1 -> b2 -> b3
   *        /
   * a1 -> a2 -> a3 -> a4 -> a5 -> a6
   *              \
   *               d1 -> d2 -> d3
   *                \
   *                 e1 -> e2 -> e3
   */

  const tree = makeComplexTree();

  const getForkOrRoot = (id: string) => {
    const node = tree.getNode(id);
    if (!node) {
      throw Error('node should not be null!');
    }
    return tree.getForkPointOrRoot(node);
  };

  expect(getForkOrRoot('a1').id).toBe('a1');
  expect(getForkOrRoot('a2').id).toBe('a2');
  expect(getForkOrRoot('a3').id).toBe('a3');
  expect(getForkOrRoot('a4').id).toBe('a3');
  expect(getForkOrRoot('b1').id).toBe('a2');
  expect(getForkOrRoot('b2').id).toBe('b2');
  expect(getForkOrRoot('b3').id).toBe('b2');
  expect(getForkOrRoot('a5').id).toBe('a3');
  expect(getForkOrRoot('a6').id).toBe('a3');
  expect(getForkOrRoot('c1').id).toBe('b2');
  expect(getForkOrRoot('c2').id).toBe('b2');
  expect(getForkOrRoot('c3').id).toBe('b2');
  expect(getForkOrRoot('d1').id).toBe('d1');
  expect(getForkOrRoot('d2').id).toBe('d1');
  expect(getForkOrRoot('d3').id).toBe('d1');
  expect(getForkOrRoot('e1').id).toBe('d1');
  expect(getForkOrRoot('e2').id).toBe('d1');
  expect(getForkOrRoot('e3').id).toBe('d1');

  const outsiderNode = new TreeNode<NodeDataType>('outsider', data);
  expect(() => tree.getForkPointOrRoot(outsiderNode)).toThrow();
});

it('rejects parentless node if tree has root', () => {
  const tree = new Tree<NodeDataType>();
  tree.createNode('root-node', data, null);

  expect(() => tree.createNode('parentless', data, null)).toThrow();
});

it('rejects node if parent not found', () => {
  const tree = new Tree<NodeDataType>();
  tree.createNode('root-node', data, null);

  expect(() => tree.createNode('foobar', data, 'unknown-parent')).toThrow();
});
