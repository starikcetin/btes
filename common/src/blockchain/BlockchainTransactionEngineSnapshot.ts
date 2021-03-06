import { BlockchainTransaction } from './BlockchainTransaction';

export interface BlockchainTransactionEngineSnapshot {
  /**
   * transaction pool = memory pool = mempool
   */
  readonly transactionPool: BlockchainTransaction[];

  /**
   * https://cryptoservices.github.io/fde/2018/12/14/bitcoin-orphan-TX-CVE.html
   */
  readonly orphanTransactionsPool: BlockchainTransaction[];
}
