import { BlockchainTx } from '../../../../common/blockchain/BlockchainTx';

export interface BlockchainTxDbData {
  readonly mempool: BlockchainTx[];
  readonly orphanage: BlockchainTx[];
}
