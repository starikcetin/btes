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
