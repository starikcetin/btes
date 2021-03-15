import { TreeNodeJsonObject } from './TreeNodeJsonObject';

export interface TreeJsonObject<TData> {
  readonly root: TreeNodeJsonObject<TData> | null;
}
