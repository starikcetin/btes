import { BlockchainTxOutPoint } from '../blockchain/tx/BlockchainTxOutPoint';

export interface BlockchainOwnUtxoSetChangedPayload {
  readonly nodeUid: string;
  readonly newOwnUtxoSet: BlockchainTxOutPoint[];
}
