import { BlockchainTx } from '../../../../common/blockchain/tx/BlockchainTx';

export interface BlockchainTxDbData {
  readonly mempool: BlockchainTx[];
  readonly orphanage: BlockchainTx[];
}
