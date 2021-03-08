import _ from 'lodash';
import { TreeNode } from './TreeNode';

export class Tree<TData> {
  /** Returns nodes from given array that are unique by id. */
  public static readonly uniq = <TData>(
    nodes: TreeNode<TData>[]
  ): TreeNode<TData>[] => {
    return _.uniqBy(nodes, (n) => n.id);
  };

  /** Returns whether given array has a node with given id. */
  public static readonly includesId = <TData>(
    nodes: TreeNode<TData>[],
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
    if (parent === null) {
      if (this._root !== null) {
        throw new Error(
          'Trying to add a parentless node, but the tree already has a root!'
        );
      }

      this._root = node;
      this._heads.push(node);
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
  };
}
