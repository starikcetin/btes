import { BlockchainBlock } from '../blockchain/block/BlockchainBlock';
import { TreeNodeJsonObject } from '../tree/TreeNodeJsonObject';

export interface BlockAddedToBlockchainPayload {
  readonly nodeUid: string;
  readonly treeNode: TreeNodeJsonObject<BlockchainBlock>;
}
