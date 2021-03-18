import { BlockchainTx } from '../../../common/blockchain/tx/BlockchainTx';

export interface TxAddedToMempoolActionPayload {
  readonly simulationUid: string;
  readonly nodeUid: string;
  readonly tx: BlockchainTx;
}
