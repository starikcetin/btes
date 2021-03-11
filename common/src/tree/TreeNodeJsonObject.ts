export interface TreeNodeJsonObject<TData> {
  id: string;
  data: TData;
  children: TreeNodeJsonObject<TData>[];
}
