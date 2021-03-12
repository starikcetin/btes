/*
 * TODO:
 *
 * 1. If a `TreeNode` with children is added usin `add` method, internal state will get
 *    garbled (heads will not be properly updated). Do we even want an `add` method?
 *    Perhaps `create` is enough.
 *
 * 2. If we decide to keep the `add` method and support adding nodes with children,
 *    `importTreeNodeJsonObject` logic can be moved to the `TreeNode` class as a
 *    `TreeNode.fromJsonObject` static method. Then we can use that to construct the
 *    node chain, and import all of them at once via root node in `Tree.importTreeJsonObject`.
 *    That way we can get rid of the weird looking `importTreeNodeJsonObject` method as well.
 */

import _ from 'lodash';

import { TreeJsonObject } from './TreeJsonObject';
import { TreeNode } from './TreeNode';
import { TreeNodeJsonObject } from './TreeNodeJsonObject';

export class Tree<TData> {
  /**
   * Creates a new tree using the given `TreeJsonObject`.
   */
  public static readonly fromJsonObject = <TData>(
    treeJsonObject: TreeJsonObject<TData>
  ): Tree<TData> => {
    const tree = new Tree<TData>();
    tree.importTreeJsonObject(treeJsonObject, null);
    return tree;
  };

  /**
   * Imports the given `TreeJsonObject` into this tree at `mountPoint`.
   * @param nodeJsonObject The `TreeJsonObject` to be imported.
   * @param mountPoint Will be the parent of the imported tree. If `null`, root of the given `treeJsonObject` will be imported as the root of this tree.
   */
  public readonly importTreeJsonObject = (
    treeJsonObject: TreeJsonObject<TData>,
    mountPoint: TreeNode<TData> | null
  ): void => {
    if (null !== treeJsonObject.root) {
      this.importTreeNodeJsonObject(treeJsonObject.root, mountPoint);
    }
  };

  /**
   * Imports the given `TreeNodeJsonObject` with all its descendants into this tree at `mountPoint`.
   * @param nodeJsonObject The `TreeNodeJsonObject` to be imported along with all its descendants.
   * @param mountPoint Will be the parent of the imported tree. If `null`, given `nodeJsonObject` will be imported as the root of this tree.
   */
  public readonly importTreeNodeJsonObject = (
    nodeJsonObject: TreeNodeJsonObject<TData>,
    mountPoint: TreeNode<TData> | null
  ): void => {
    const current = this.createNode(
      nodeJsonObject.id,
      nodeJsonObject.data,
      mountPoint
    );

    for (const child of nodeJsonObject.children) {
      this.importTreeNodeJsonObject(child, current);
    }
  };

  /** Returns nodes from given array that are unique by id. */
  public static readonly uniq = <TData>(
    nodes: TreeNode<TData>[]
  ): TreeNode<TData>[] => {
    return _.uniqBy(nodes, (n) => n.id);
  };

  /** Returns whether given array has a node with given id. */
  public static readonly includesId = <TData>(
    nodes: readonly TreeNode<TData>[],
    nodeId: string
  ): boolean => {
    return nodes.some((n) => n.id === nodeId);
  };

  private _root: TreeNode<TData> | null = null;
  public get root(): TreeNode<TData> | null {
    return this._root;
  }

  private readonly _forkPoints: TreeNode<TData>[] = [];
  public get forkPoints(): ReadonlyArray<TreeNode<TData>> {
    return [...this._forkPoints];
  }

  private readonly _heads: TreeNode<TData>[] = [];
  public get heads(): ReadonlyArray<TreeNode<TData>> {
    return [...this._heads];
  }

  private _mainBranchHead: TreeNode<TData> | null = null;
  public get mainBranchHead(): TreeNode<TData> | null {
    return this._mainBranchHead;
  }

  public readonly createNode = (
    id: string,
    data: TData,
    parent: TreeNode<TData> | null
  ): TreeNode<TData> => {
    const node = new TreeNode<TData>(id, data);
    this.addNode(node, parent);
    return node;
  };

  public readonly addNode = (
    node: TreeNode<TData>,
    parent: TreeNode<TData> | null
  ): void => {
    if (node.hasParent) {
      throw new Error(
        'Trying to add a node that has a parent! Importing dirty nodes is not supported.' +
          'If you are trying to import JSON objects, use one of these: Tree.fromJsonObject`, `tree.importTreeJsonObject`, `tree.importTreeNodeJsonObject`.'
      );
    }

    if (node.children.length > 0) {
      throw new Error(
        'Trying to add a node that has children! Importing dirty nodes is not supported.' +
          'If you are trying to import JSON objects, use one of these: Tree.fromJsonObject`, `tree.importTreeJsonObject`, `tree.importTreeNodeJsonObject`.'
      );
    }

    if (parent === null) {
      if (this._root !== null) {
        throw new Error(
          'Trying to add a parentless node, but the tree already has a root!'
        );
      }

      this._root = node;
      this._heads.push(node);
      this._mainBranchHead = node;
    } else {
      if (parent.children.length > 0) {
        this.registerForkPoint(parent);
      }

      parent.addChild(node);
      node.setParent(parent);

      this.updateHeadsAfterAdd(parent.id, node);
    }
  };

  public readonly getNode = (nodeId: string): TreeNode<TData> | null => {
    return this.searchBackMultiple(nodeId, this._heads, []);
  };

  /** Returns the first fork point in this node's ancestors, or the root point if no fork points are found. */
  public readonly getForkPointOrRoot = (
    node: TreeNode<TData>
  ): TreeNode<TData> => {
    return this._getForkPointOrRootWithHeight(node).forkPointOrRoot;
  };

  public readonly isRootNode = (nodeId: string): boolean => {
    return this._root !== null && this._root.id === nodeId;
  };

  public readonly isForkPoint = (nodeId: string): boolean => {
    return Tree.includesId(this._forkPoints, nodeId);
  };

  public readonly isHeadNode = (nodeId: string): boolean => {
    return Tree.includesId(this._heads, nodeId);
  };

  /** 0 based distance of the given node from the first fork point or root. */
  public readonly getNodeHeightFromForkPointOrRoot = (
    node: TreeNode<TData>
  ): number => {
    return this._getForkPointOrRootWithHeight(node).height;
  };

  /** Returns an iterator that yields nodes. Starts from the head of main branch, goes backwards to the root. */
  public readonly getMainBranchIterator = (): Iterable<TreeNode<TData>> => {
    return this._mainBranchHead?.getIteratorToRoot() ?? [];
  };

  /** Returns an iterator that yields data. Starts from the head of main branch, goes backwards to the root. */
  public readonly getMainBranchDataIterator = (): Iterable<TData> => {
    return this._mainBranchHead?.getDataIteratorToRoot() ?? [];
  };

  /**
   * Returns a JSON serializable version of this tree with a nested object data structure.
   * `data` fields of all nodes will be directly included, so YOU need to make sure `TData`
   * is JSON seiralizable as well.
   */
  public readonly toJsonObject = (): TreeJsonObject<TData> => {
    return {
      root: this.root?.toJsonObject() || null,
    };
  };

  /**
   * Returns,
   * 1. The first fork point in this node's ancestors, or the root point if no fork points are found
   * 2. The 0-based height of the given node relative to the fork point or root
   */
  private readonly _getForkPointOrRootWithHeight = (
    node: TreeNode<TData>
  ): { forkPointOrRoot: TreeNode<TData>; height: number } => {
    let count = 0;
    let currentNode = node;

    // eslint-disable-next-line no-constant-condition
    while (
      !this.isRootNode(currentNode.id) &&
      !this.isForkPoint(currentNode.id)
    ) {
      if (null === currentNode.parent) {
        throw new Error('A node has no parent, but is not the root node!');
      }

      count++;
      currentNode = currentNode.parent;
    }

    return { height: count, forkPointOrRoot: currentNode };
  };

  /** Adds a node to fork points array if it is not already there. */
  private readonly registerForkPoint = (forkPoint: TreeNode<TData>): void => {
    if (!Tree.includesId(this._forkPoints, forkPoint.id)) {
      this._forkPoints.push(forkPoint);
    }
  };

  /**
   * Searches backwards from all `startNodes` until a node with `targetId` is found.
   * Does not search beyond fork points given in `ignoreForkPoints`.
   * @returns target node if found, `null` otherwise
   */
  private readonly searchBackMultiple = (
    targetId: string,
    startNodes: TreeNode<TData>[],
    ignoreForksPoints: TreeNode<TData>[]
  ): TreeNode<TData> | null => {
    const nextIgnoreForkPoints = ignoreForksPoints;
    const nextHeads: TreeNode<TData>[] = [];

    for (const startNode of startNodes) {
      const { stopType, stopNode } = this.searchBackUntilForkOrRoot(
        targetId,
        startNode
      );

      if (stopType === 'target') {
        return stopNode;
      } else if (stopType === 'fork') {
        if (null === stopNode.parent) {
          throw new Error('A node has no parent, but is not the root node!');
        }

        // do not visit the same fork point more than once
        if (!Tree.includesId(nextIgnoreForkPoints, stopNode.id)) {
          nextIgnoreForkPoints.push(stopNode);

          if (!Tree.includesId(nextHeads, stopNode.id)) {
            nextHeads.push(stopNode.parent);
          }
        }
      }
      // else if (stopType === 'root') {
      //   // there is nothing to search for beyond the root node, ignore
      // }
    }

    return nextHeads.length === 0
      ? null
      : this.searchBackMultiple(targetId, nextHeads, nextIgnoreForkPoints);
  };

  /** Searches backwards from `start` until it hits the target, a fork point, or the tree root. */
  private readonly searchBackUntilForkOrRoot = (
    targetId: string,
    startNode: TreeNode<TData>
  ): { stopType: 'root' | 'fork' | 'target'; stopNode: TreeNode<TData> } => {
    let currentNode = startNode;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (currentNode.id === targetId) {
        return { stopType: 'target', stopNode: currentNode };
      }

      if (this.isRootNode(currentNode.id)) {
        return { stopType: 'root', stopNode: currentNode };
      }

      if (null === currentNode.parent) {
        throw new Error('A node has no parent, but is not the root node!');
      }

      if (this.isForkPoint(currentNode.id)) {
        return { stopType: 'fork', stopNode: currentNode };
      }

      currentNode = currentNode.parent;
    }
  };

  private readonly updateHeadsAfterAdd = (
    parentId: string,
    childNode: TreeNode<TData>
  ) => {
    _.remove(this._heads, (n) => n.id === parentId);
    this._heads.push(childNode);

    if (null === this._mainBranchHead) {
      throw new Error('Main branch head is null!');
    }

    // the use of `>` instead of `>=` is intentional
    // we don't want to switch if they have the same height
    if (childNode.height > this._mainBranchHead.height) {
      this._mainBranchHead = childNode;
    }
  };
}
