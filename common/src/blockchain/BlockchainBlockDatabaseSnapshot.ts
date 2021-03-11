import { TreeJsonObject } from '../tree/TreeJsonObject';
import { BlockchainBlock } from './BlockchainBlock';

export interface BlockchainBlockDatabaseSnapshot {
  blocks: TreeJsonObject<BlockchainBlock>;
  orphanBlocks: BlockchainBlock[];
}
