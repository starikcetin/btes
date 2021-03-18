import { BlockchainBlock } from '../../../common/blockchain/block/BlockchainBlock';
import { TreeNodeJsonObject } from '../../../common/tree/TreeNodeJsonObject';

export interface BlockAddedToBlockchainActionPayload {
  readonly simulationUid: string;
  readonly nodeUid: string;
  readonly treeNode: TreeNodeJsonObject<BlockchainBlock>;
}
