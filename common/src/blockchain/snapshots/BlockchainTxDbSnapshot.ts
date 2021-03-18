import { BlockchainRegularTx } from '../tx/BlockchainTx';

export interface BlockchainTxDbSnapshot {
  /**
   * `transaction pool` = `memory pool` = `mempool`
   */
  readonly mempool: BlockchainRegularTx[];

  /**
   * `orphan transactions pool`
   * https://cryptoservices.github.io/fde/2018/12/14/bitcoin-orphan-TX-CVE.html
   */
  readonly orphanage: BlockchainRegularTx[];
}
