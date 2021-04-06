import { BlockchainBlock } from '../../../common/blockchain/block/BlockchainBlock';

export interface BlocksRemovedFromOrphanageActionPayload {
  readonly simulationUid: string;
  readonly nodeUid: string;
  readonly removedBlocks: BlockchainBlock[];
}
