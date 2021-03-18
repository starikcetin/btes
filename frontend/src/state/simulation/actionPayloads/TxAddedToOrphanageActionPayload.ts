import { BlockchainTx } from '../../../common/blockchain/tx/BlockchainTx';

export interface TxAddedToOrphanageActionPayload {
  readonly simulationUid: string;
  readonly nodeUid: string;
  readonly tx: BlockchainTx;
}
