import { BlockchainBlock } from '../blockchain/block/BlockchainBlock';

export interface BlockAddedToOrphanagePayload {
  readonly nodeUid: string;
  readonly block: BlockchainBlock;
}
