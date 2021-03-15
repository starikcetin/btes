import { BlockchainTx } from './BlockchainTx';

export interface BlockchainTxDbSnapshot {
  /**
   * `transaction pool` = `memory pool` = `mempool`
   */
  readonly mempool: BlockchainTx[];

  /**
   * `orphan transactions pool`
   * https://cryptoservices.github.io/fde/2018/12/14/bitcoin-orphan-TX-CVE.html
   */
  readonly orphanage: BlockchainTx[];
}
