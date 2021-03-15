export interface TreeNodeJsonObject<TData> {
  readonly id: string;
  readonly data: TData;
  readonly children: TreeNodeJsonObject<TData>[];
}
