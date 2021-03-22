import { BlockchainBlock } from '../../../../common/blockchain/block/BlockchainBlock';
import { TreeJsonObject } from '../../../../common/tree/TreeJsonObject';
import { BlockLookup } from './BlockLookup';

export interface BlockchainBlockDbData {
  // synced state
  readonly blockchain: TreeJsonObject<BlockchainBlock>;
  readonly orphanage: BlockchainBlock[];

  // derived state
  readonly blockchainLookup: BlockLookup;
}
