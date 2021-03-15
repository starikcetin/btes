import { TreeJsonObject } from '../tree/TreeJsonObject';
import { BlockchainBlock } from './BlockchainBlock';

export interface BlockchainBlockDbSnapshot {
  blockchain: TreeJsonObject<BlockchainBlock>;
  orphanage: BlockchainBlock[];
}
