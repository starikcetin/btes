import { TreeNode } from './TreeNode';
import { TreeNodeJsonObject } from './TreeNodeJsonObject';

interface NodeDataType {
  a: number;
  b: string;
}

const data: NodeDataType = {
  a: 1,
  b: 'foobar',
};

const connectNodes = <TData>({
  parent,
  child,
}: {
  parent: TreeNode<TData>;
  child: TreeNode<TData>;
}) => {
  parent.addChild(child);
  child.setParent(parent);
};

it('sets parent correctly', () => {
  const parent = new TreeNode('parent-id', data);
  const child = new TreeNode('child-id', data);

  expect(parent.parent).toBeNull();
  expect(parent.hasParent).toBe(false);
  expect(child.parent).toBeNull();
  expect(child.hasParent).toBe(false);

  child.setParent(parent);

  expect(parent.parent).toBeNull();
  expect(parent.hasParent).toBe(false);
  expect(child.parent).toBe(parent);
  expect(child.hasParent).toBe(true);
});

it('adds children correctly', () => {
  const parent = new TreeNode('parent-id', data);
  const childA = new TreeNode('child-a-id', data);
  const childB = new TreeNode('child-b-id', data);

  expect(childA.children.length).toBe(0);
  expect(childB.children.length).toBe(0);
  expect(parent.children.length).toBe(0);

  parent.addChild(childA);

  expect(childA.children.length).toBe(0);
  expect(childB.children.length).toBe(0);
  expect(parent.children.length).toBe(1);
  expect(parent.children).toContain(childA);

  parent.addChild(childB);

  expect(childA.children.length).toBe(0);
  expect(childB.children.length).toBe(0);
  expect(parent.children.length).toBe(2);
  expect(parent.children).toContain(childA);
  expect(parent.children).toContain(childB);
});

it('retains data', () => {
  const parent = new TreeNode('parent-id', data);
  const childA = new TreeNode('child-a-id', data);
  const childB = new TreeNode('child-b-id', data);

  expect(parent.data).toBe(data);
  expect(childA.data).toBe(data);
  expect(childB.data).toBe(data);

  childA.setParent(parent);
  parent.addChild(childA);
  childB.setParent(parent);
  parent.addChild(childB);

  expect(parent.data).toBe(data);
  expect(childA.data).toBe(data);
  expect(childB.data).toBe(data);
});

it('retains id', () => {
  const parentId = 'parent-id';
  const childAId = 'child-a-id';
  const childBId = 'child-b-id';

  const parent = new TreeNode(parentId, data);
  const childA = new TreeNode(childAId, data);
  const childB = new TreeNode(childBId, data);

  expect(parent.id).toBe(parentId);
  expect(childA.id).toBe(childAId);
  expect(childB.id).toBe(childBId);

  childA.setParent(parent);
  parent.addChild(childA);
  childB.setParent(parent);
  parent.addChild(childB);

  expect(parent.id).toBe(parentId);
  expect(childA.id).toBe(childAId);
  expect(childB.id).toBe(childBId);
});

it('counts height', () => {
  const root = new TreeNode('a', data);
  const firstChild = new TreeNode('b', data);
  const secondChild = new TreeNode('c', data);

  expect(root.height).toBe(0);
  expect(firstChild.height).toBe(0);
  expect(secondChild.height).toBe(0);

  firstChild.setParent(root);
  root.addChild(firstChild);

  secondChild.setParent(firstChild);
  firstChild.addChild(secondChild);

  expect(root.height).toBe(0);
  expect(firstChild.height).toBe(1);
  expect(secondChild.height).toBe(2);
});

it('converts to JSON object', () => {
  const parentId = 'parent-id';
  const childAId = 'child-a-id';
  const childBId = 'child-b-id';

  const parent = new TreeNode(parentId, data);
  const childA = new TreeNode(childAId, data);
  const childB = new TreeNode(childBId, data);

  childA.setParent(parent);
  parent.addChild(childA);
  childB.setParent(parent);
  parent.addChild(childB);

  const expectedJsonObject: TreeNodeJsonObject<NodeDataType> = {
    id: parentId,
    data,
    children: [
      {
        id: childAId,
        data,
        children: [],
      },
      {
        id: childBId,
        data,
        children: [],
      },
    ],
  };

  const jsonObject = parent.toJsonObject();

  expect(jsonObject).toStrictEqual(expectedJsonObject);
});

it('converts from JSON object', () => {
  const parentId = 'parent-id';
  const childAId = 'child-a-id';
  const childBId = 'child-b-id';

  const jsonObject: TreeNodeJsonObject<NodeDataType> = {
    id: parentId,
    data,
    children: [
      {
        id: childAId,
        data,
        children: [],
      },
      {
        id: childBId,
        data,
        children: [],
      },
    ],
  };

  const parent = TreeNode.fromJsonObject(jsonObject);
  expect(parent.id).toBe(parentId);
  expect(parent.data).toStrictEqual(data);
  expect(parent.parent).toBeNull();
  expect(parent.children).toHaveLength(2);

  const childA = parent.children[0];
  expect(childA.id).toBe(childAId);
  expect(childA.data).toStrictEqual(data);
  expect(childA.parent).toBe(parent);
  expect(childA.children).toHaveLength(0);

  const childB = parent.children[1];
  expect(childB.id).toBe(childBId);
  expect(childB.data).toStrictEqual(data);
  expect(childB.parent).toBe(parent);
  expect(childB.children).toHaveLength(0);
});

it('counts depth', () => {
  /*
   *       d -> e -> f
   *      /
   * a -> b -> c
   */

  const a = new TreeNode('a', data);
  const b = new TreeNode('b', data);
  const c = new TreeNode('c', data);
  const d = new TreeNode('d', data);
  const e = new TreeNode('e', data);
  const f = new TreeNode('f', data);

  expect(a.depth).toBe(0);
  expect(b.depth).toBe(0);
  expect(c.depth).toBe(0);
  expect(d.depth).toBe(0);
  expect(e.depth).toBe(0);
  expect(f.depth).toBe(0);

  connectNodes({ parent: a, child: b });
  connectNodes({ parent: b, child: c });
  connectNodes({ parent: b, child: d });
  connectNodes({ parent: d, child: e });
  connectNodes({ parent: e, child: f });

  expect(a.depth).toBe(4);
  expect(b.depth).toBe(3);
  expect(c.depth).toBe(0);
  expect(d.depth).toBe(2);
  expect(e.depth).toBe(1);
  expect(f.depth).toBe(0);
});

it('detemines if is head', () => {
  /*
   *       d -> e -> f
   *      /
   * a -> b -> c
   */

  const a = new TreeNode('a', data);
  const b = new TreeNode('b', data);
  const c = new TreeNode('c', data);
  const d = new TreeNode('d', data);
  const e = new TreeNode('e', data);
  const f = new TreeNode('f', data);

  expect(a.isHead).toBe(true);
  expect(b.isHead).toBe(true);
  expect(c.isHead).toBe(true);
  expect(d.isHead).toBe(true);
  expect(e.isHead).toBe(true);
  expect(f.isHead).toBe(true);

  connectNodes({ parent: a, child: b });
  connectNodes({ parent: b, child: c });
  connectNodes({ parent: b, child: d });
  connectNodes({ parent: d, child: e });
  connectNodes({ parent: e, child: f });

  expect(a.isHead).toBe(false);
  expect(b.isHead).toBe(false);
  expect(c.isHead).toBe(true);
  expect(d.isHead).toBe(false);
  expect(e.isHead).toBe(false);
  expect(f.isHead).toBe(true);
});
