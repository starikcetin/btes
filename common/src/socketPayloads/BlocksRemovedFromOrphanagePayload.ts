import { BlockchainBlock } from '../blockchain/block/BlockchainBlock';

export interface BlocksRemovedFromOrphanagePayload {
  readonly nodeUid: string;
  readonly removedBlocks: BlockchainBlock[];
}
