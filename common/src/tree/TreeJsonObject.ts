import { TreeNodeJsonObject } from './TreeNodeJsonObject';

export interface TreeJsonObject<TData> {
  root: TreeNodeJsonObject<TData> | null;
}
