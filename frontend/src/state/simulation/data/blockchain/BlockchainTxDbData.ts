import { BlockchainTx } from '../../../../common/blockchain/tx/BlockchainTx';
import { TxLookup } from './TxLookup';

export interface BlockchainTxDbData {
  // synced state
  readonly mempool: BlockchainTx[];
  readonly orphanage: BlockchainTx[];

  // derived state
  readonly mempoolTxLookup: TxLookup;
  readonly orphanageTxLookup: TxLookup;
}
