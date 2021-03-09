import { Tree } from './Tree';
import { TreeNode } from './TreeNode';
import { TreeJsonObject } from './TreeJsonObject';

interface NodeDataType {
  a: number;
  b: string;
}

const data: NodeDataType = {
  a: 1,
  b: 'foobar',
};

function makeComplexTree() {
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

  const a1 = tree.createNode('a1', data, null);
  const a2 = tree.createNode('a2', data, a1);
  const a3 = tree.createNode('a3', data, a2);
  const a4 = tree.createNode('a4', data, a3);
  const a5 = tree.createNode('a5', data, a4);
  const a6 = tree.createNode('a6', data, a5);
  const b1 = tree.createNode('b1', data, a2);
  const b2 = tree.createNode('b2', data, b1);
  const b3 = tree.createNode('b3', data, b2);
  const c1 = tree.createNode('c1', data, b2);
  const c2 = tree.createNode('c2', data, c1);
  const c3 = tree.createNode('c3', data, c2);
  const d1 = tree.createNode('d1', data, a3);
  const d2 = tree.createNode('d2', data, d1);
  const d3 = tree.createNode('d3', data, d2);
  const e1 = tree.createNode('e1', data, d1);
  const e2 = tree.createNode('e2', data, e1);
  const e3 = tree.createNode('e3', data, e2);

  return {
    tree,
    nodes: {
      a1,
      a2,
      a3,
      a4,
      a5,
      a6,
      b1,
      b2,
      b3,
      c1,
      c2,
      c3,
      d1,
      d2,
      d3,
      e1,
      e2,
      e3,
    },
  };
}

function idsOf<TData>(nodes: ReadonlyArray<TreeNode<TData>>) {
  return nodes.map((n) => n.id);
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

it('determines if node array includes id', () => {
  const nodeA = new TreeNode<NodeDataType>('nodeA', data);
  const nodeB = new TreeNode<NodeDataType>('nodeB', data);
  const nodeC = new TreeNode<NodeDataType>('nodeC', data);
  const array = [nodeA, nodeB];

  expect(Tree.includesId(array, nodeA.id)).toBe(true);
  expect(Tree.includesId(array, nodeB.id)).toBe(true);
  expect(Tree.includesId(array, nodeC.id)).toBe(false);
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
  const tree = makeComplexTree().tree;

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

  const tree = makeComplexTree().tree;
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
  const tree = makeComplexTree().tree;

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

  const tree = makeComplexTree().tree;
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

  const tree = makeComplexTree().tree;

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

it('calculates heights from fork points or root', () => {
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
  const tree = makeComplexTree().tree;

  const getHeightFromForkOrRoot = (id: string) => {
    const node = tree.getNode(id);
    if (!node) {
      throw Error('node should not be null!');
    }
    return tree.getNodeHeightFromForkPointOrRoot(node);
  };

  expect(getHeightFromForkOrRoot('a1')).toBe(0);
  expect(getHeightFromForkOrRoot('a2')).toBe(0);
  expect(getHeightFromForkOrRoot('a3')).toBe(0);
  expect(getHeightFromForkOrRoot('a4')).toBe(1);
  expect(getHeightFromForkOrRoot('a5')).toBe(2);
  expect(getHeightFromForkOrRoot('a6')).toBe(3);
  expect(getHeightFromForkOrRoot('b1')).toBe(1);
  expect(getHeightFromForkOrRoot('b2')).toBe(0);
  expect(getHeightFromForkOrRoot('b3')).toBe(1);
  expect(getHeightFromForkOrRoot('c1')).toBe(1);
  expect(getHeightFromForkOrRoot('c2')).toBe(2);
  expect(getHeightFromForkOrRoot('c3')).toBe(3);
  expect(getHeightFromForkOrRoot('d1')).toBe(0);
  expect(getHeightFromForkOrRoot('d2')).toBe(1);
  expect(getHeightFromForkOrRoot('d3')).toBe(2);
  expect(getHeightFromForkOrRoot('e1')).toBe(1);
  expect(getHeightFromForkOrRoot('e2')).toBe(2);
  expect(getHeightFromForkOrRoot('e3')).toBe(3);

  const outsiderNode = new TreeNode<NodeDataType>('outsider', data);
  expect(() => tree.getNodeHeightFromForkPointOrRoot(outsiderNode)).toThrow();
});

it('converts to json object', () => {
  const tree = makeComplexTree().tree;
  expect(tree.toJsonObject()).toMatchSnapshot();
});

it('makes tree from json object', () => {
  const treeA = makeComplexTree().tree;
  const jsonObjA = treeA.toJsonObject();

  const treeB = Tree.fromJsonObject(jsonObjA);
  const jsonObjB = treeB.toJsonObject();

  expect(jsonObjA).toStrictEqual(jsonObjB);

  expect(idsOf(treeA.forkPoints)).toIncludeSameMembers(idsOf(treeB.forkPoints));
  expect(idsOf(treeA.heads)).toIncludeSameMembers(idsOf(treeB.heads));
  expect(treeA.root?.id).toBe(treeB.root?.id);
});

describe('guards against dirty node add', () => {
  it('throws on adding node with parent', () => {
    const { tree, nodes: treeNodes } = makeComplexTree();

    const parent = new TreeNode('parent', data);
    const child = new TreeNode('child', data);
    child.setParent(parent);
    parent.addChild(child);

    expect(() => tree.addNode(child, treeNodes.a6)).toThrow();
    expect(() => tree.addNode(child, treeNodes.a1)).toThrow();
    expect(() => tree.addNode(child, treeNodes.b2)).toThrow();
  });

  it('throws on adding node with children', () => {
    const { tree, nodes: treeNodes } = makeComplexTree();

    const parent = new TreeNode('parent', data);
    const child = new TreeNode('child', data);
    child.setParent(parent);
    parent.addChild(child);

    expect(() => tree.addNode(parent, treeNodes.a6)).toThrow();
    expect(() => tree.addNode(parent, treeNodes.a1)).toThrow();
    expect(() => tree.addNode(parent, treeNodes.b2)).toThrow();
  });

  it('throws on adding node with children and parent', () => {
    const { tree, nodes: treeNodes } = makeComplexTree();

    const parent = new TreeNode('parent', data);
    const node = new TreeNode('node', data);
    const child = new TreeNode('child', data);
    node.setParent(parent);
    child.setParent(node);
    parent.addChild(node);
    node.addChild(child);

    expect(() => tree.addNode(node, treeNodes.a6)).toThrow();
    expect(() => tree.addNode(node, treeNodes.a1)).toThrow();
    expect(() => tree.addNode(node, treeNodes.b2)).toThrow();
  });

  it('does not throw on adding clean node', () => {
    const { tree, nodes: treeNodes } = makeComplexTree();

    const node = new TreeNode('node', data);

    expect(() => tree.addNode(node, treeNodes.a6)).not.toThrow();
  });
});
