import { BlockchainTx } from '../blockchain/tx/BlockchainTx';

export interface BlockchainBroadcastTxPayload {
  readonly nodeUid: string;
  readonly tx: BlockchainTx;
}
