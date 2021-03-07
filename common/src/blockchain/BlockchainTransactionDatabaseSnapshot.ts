import { BlockchainTransaction } from './BlockchainTransaction';

export interface BlockchainTransactionDatabaseSnapshot {
  /**
   * `transaction pool` = `memory pool` = `mempool`
   */
  readonly mempool: BlockchainTransaction[];

  /**
   * `orphan transactions pool`
   * https://cryptoservices.github.io/fde/2018/12/14/bitcoin-orphan-TX-CVE.html
   */
  readonly orphanage: BlockchainTransaction[];
}
