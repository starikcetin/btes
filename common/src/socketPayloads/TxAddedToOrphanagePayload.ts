import { BlockchainTx } from '../blockchain/tx/BlockchainTx';

export interface TxAddedToOrphanagePayload {
  readonly nodeUid: string;
  readonly tx: BlockchainTx;
}
