import { TreeJsonObject } from '../../tree/TreeJsonObject';
import { BlockchainBlock } from '../block/BlockchainBlock';

export interface BlockchainBlockDbSnapshot {
  blockchain: TreeJsonObject<BlockchainBlock>;
  orphanage: BlockchainBlock[];
}
