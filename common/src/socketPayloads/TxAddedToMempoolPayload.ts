import { BlockchainTx } from '../blockchain/tx/BlockchainTx';

export interface TxAddedToMempoolPayload {
  readonly nodeUid: string;
  readonly tx: BlockchainTx;
}
