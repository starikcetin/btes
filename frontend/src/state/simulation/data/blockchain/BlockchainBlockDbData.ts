import { BlockchainBlock } from '../../../../common/blockchain/block/BlockchainBlock';
import { TreeJsonObject } from '../../../../common/tree/TreeJsonObject';

export interface BlockchainBlockDbData {
  // synced state
  readonly blockchain: TreeJsonObject<BlockchainBlock>;
  readonly orphanage: BlockchainBlock[];

  // derived state
  readonly blockchainLookup: Record<string, BlockchainBlock>;
}
