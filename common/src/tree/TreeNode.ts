export class TreeNode<TData> {
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

  public readonly setParent = (parent: TreeNode<TData>): void => {
    this._parent = parent;
  };

  public readonly addChild = (node: TreeNode<TData>): void => {
    this._children.push(node);
  };
}
