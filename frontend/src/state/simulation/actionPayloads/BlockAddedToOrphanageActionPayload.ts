import { BlockchainBlock } from '../../../common/blockchain/block/BlockchainBlock';

export interface BlockAddedToOrphanageActionPayload {
  readonly simulationUid: string;
  readonly nodeUid: string;
  readonly block: BlockchainBlock;
}
