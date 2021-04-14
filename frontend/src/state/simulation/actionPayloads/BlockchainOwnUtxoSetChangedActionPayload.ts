import { BlockchainTxOutPoint } from '../../../common/blockchain/tx/BlockchainTxOutPoint';

export interface BlockchainOwnUtxoSetChangedActionPayload {
  readonly simulationUid: string;
  readonly nodeUid: string;
  readonly newOwnUtxoSet: BlockchainTxOutPoint[];
}
