import _ from 'lodash';

import { TreeNodeJsonObject } from './TreeNodeJsonObject';
import { hasValue } from '../utils/hasValue';

export class TreeNode<TData> {
  /**
   * Constructs a `TreeNode` with all its descendants using the given `TreeNodeJsonObject`.
   */
  public static fromJsonObject = <TData>(
    jsonObject: TreeNodeJsonObject<TData>
  ): TreeNode<TData> => {
    const current = new TreeNode<TData>(jsonObject.id, jsonObject.data);

    for (const childJsonObject of jsonObject.children) {
      const child = TreeNode.fromJsonObject(childJsonObject);
      child.setParent(current);
      current.addChild(child);
    }

    return current;
  };

  private _parent: TreeNode<TData> | null = null;
  public get parent(): TreeNode<TData> | null {
    return this._parent;
  }

  private _children: TreeNode<TData>[] = [];
  public get children(): ReadonlyArray<TreeNode<TData>> {
    return [...this._children];
  }

  public get hasParent(): boolean {
    return null !== this._parent;
  }

  public readonly id: string;
  public readonly data: TData;

  constructor(id: string, data: TData) {
    this.id = id;
    this.data = data;
  }

  /** 0-based distance from the root */
  public get height(): number {
    let count = 0;
    let currentNode = this.parent;

    while (currentNode !== null) {
      count++;
      currentNode = currentNode.parent;
    }

    return count;
  }

  /** A node is a head if it has no children */
  public get isHead(): boolean {
    return this._children.length === 0;
  }

  /**
   * Sets the parent directly.
   * If you are calling this outside the `Tree` class, make sure you know what you are doing.
   */
  public readonly setParent = (parent: TreeNode<TData>): void => {
    this._parent = parent;
  };

  /**
   * Adds a child directly.
   * If you are calling this outside the `Tree` class, make sure you know what you are doing.
   */
  public readonly addChild = (node: TreeNode<TData>): void => {
    this._children.push(node);
  };

  /** 0-based distance from the highest descendant. 0 if this node is a head (no children). */
  public get depth(): number {
    const maxChildDepth = _.max(this._children.map((c) => c.depth));
    return hasValue(maxChildDepth) ? maxChildDepth + 1 : 0;
  }

  /** Returns an iterator that yields nodes. Starts from this node, goes backwards to the root. */
  public readonly getIteratorToRoot = (): Generator<TreeNode<TData>> =>
    this._getIteratorToRoot.call(this);

  private *_getIteratorToRoot() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    let currentBlock: TreeNode<TData> | null = this;

    while (null !== currentBlock) {
      yield currentBlock;
      currentBlock = currentBlock.parent;
    }
  }

  /** Returns an iterator that yields data. Starts from this node, goes backwards to the root. */
  public readonly getDataIteratorToRoot = (): Generator<TData> =>
    this._getDataIteratorToRoot.call(this);

  private *_getDataIteratorToRoot() {
    for (const node of this.getIteratorToRoot()) {
      yield node.data;
    }
  }

  /**
   * Returns a JSON serializable version of this tree with a nested object data structure.
   * `data` field will be directly included, so YOU need to make sure `TData` is JSON
   * seiralizable as well.
   */
  public readonly toJsonObject = (): TreeNodeJsonObject<TData> => {
    return {
      id: this.id,
      data: this.data,
      children: this.children.map((c) => c.toJsonObject()),
    };
  };
}
