import _ from 'lodash';
import { TreeNode } from './TreeNode';

export class Tree<TData> {
  /** Returns nodes from given array that are unique by id. */
  public static readonly uniq = <TData>(
    nodes: TreeNode<TData>[]
  ): TreeNode<TData>[] => {
    return _.uniqBy(nodes, (n) => n.id);
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
    data: TData,
    id: string,
    parentId: string | null
  ): TreeNode<TData> => {
    const node = new TreeNode<TData>(id, data);
    this.addNode(node, parentId);
    return node;
  };

  public readonly addNode = (
    node: TreeNode<TData>,
    parentId: string | null
  ): void => {
    if (parentId === null) {
      if (this._root !== null) {
        throw new Error(
          'Trying to add a parentless node, but the tree already has a root!'
        );
      }

      this._root = node;
      this._heads.push(node);
    } else {
      const parent = this.getNode(parentId);

      if (parent === null) {
        throw new Error('Parent node not found!');
      }

      if (parent.children.length > 0) {
        this.registerBurst(parent);
      }

      parent.addChild(node);
      node.setParent(parent);

      this.updateHeadsAfterAdd(parentId, node);
    }
  };

  public readonly getNode = (nodeId: string): TreeNode<TData> | null => {
    return this.searchBackMultiple(nodeId, this._heads);
  };

  /** Returns the first fork point in this node's ancestors, or the root point if no fork points are found. */
  public readonly getForkPointOrRoot = (
    node: TreeNode<TData>
  ): TreeNode<TData> => {
    let currentNode = node;

    while (
      !this.isRootNode(currentNode.id) &&
      !this.isSpreadNode(currentNode.id)
    ) {
      if (null === node.parent) {
        throw new Error('A node has no parent, but is not the root node!');
      }

      currentNode = node.parent;
    }

    return currentNode;
  };

  public readonly isRootNode = (nodeId: string): boolean => {
    return this._root !== null && this._root.id === nodeId;
  };

  public readonly isSpreadNode = (nodeId: string): boolean => {
    return this._forkPoints.some((n) => n.id === nodeId);
  };

  public readonly isHeadNode = (nodeId: string): boolean => {
    return this._heads.some((n) => n.id === nodeId);
  };

  /** Adds a node to bursts array if it is not already there. */
  private readonly registerBurst = (forkPoint: TreeNode<TData>): void => {
    if (_.findIndex(this._forkPoints, (n) => n.id === forkPoint.id) === -1) {
      this._forkPoints.push(forkPoint);
    }
  };

  /**
   * Searches backwards from all `startNodes` until a node with `targetId` is found.
   * @returns target node if found, `null` otherwise
   */
  private readonly searchBackMultiple = (
    targetId: string,
    startNodes: TreeNode<TData>[]
  ): TreeNode<TData> | null => {
    const nextHeads: TreeNode<TData>[] = [];

    for (const startNode of startNodes) {
      const searchResult = this.searchBackUntilForkOrRoot(targetId, startNode);

      if (searchResult.stopType === 'target') {
        return searchResult.stopNode;
      } else if (searchResult.stopType === 'fork') {
        nextHeads.push(searchResult.stopNode);
      }
      // else if (searchResult.stopType === 'root') {
      //   // there is nothing to search for beyond the root node, ignore
      // }
    }

    return nextHeads.length === 0
      ? null
      : this.searchBackMultiple(targetId, Tree.uniq(nextHeads));
  };

  /** Searches backwards from `start` until it hits the target, a fork point, or the tree root. */
  private readonly searchBackUntilForkOrRoot = (
    targetId: string,
    startNode: TreeNode<TData>
  ): { stopType: 'root' | 'fork' | 'target'; stopNode: TreeNode<TData> } => {
    let currentNode = startNode;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      if (this.isSpreadNode(currentNode.id)) {
        return { stopType: 'fork', stopNode: currentNode };
      }

      if (this.isRootNode(currentNode.id)) {
        return { stopType: 'root', stopNode: currentNode };
      }

      if (currentNode.id === targetId) {
        return { stopType: 'target', stopNode: currentNode };
      }

      if (null === currentNode.parent) {
        throw new Error('A node has no parent, but is not the root node!');
      }

      currentNode = currentNode.parent;
    }
  };

  private readonly updateHeadsAfterAdd = (
    parentId: string,
    childNode: TreeNode<TData>
  ) => {
    const removed = _.remove(this._heads, (n) => n.id === parentId);
    if (removed.length > 0) {
      this._heads.push(childNode);
    }
  };
}
