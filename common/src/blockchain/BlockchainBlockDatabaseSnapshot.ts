import { BlockchainBlock } from './BlockchainBlock';

export interface BlockchainBlockDatabaseSnapshot {
  blocks: BlockchainBlock[];
  orphanBlocks: BlockchainBlock[];
}
