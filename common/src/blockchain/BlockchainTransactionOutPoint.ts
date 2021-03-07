/**
 * https://en.bitcoin.it/wiki/Protocol_documentation#tx
 */
export interface BlockchainTransactionOutPoint {
  /**
   * `hash`
   * The hash of the referenced transaction.
   */
  readonly txHash: string;

  /**
   * `index`
   * The index of the specific output in the transaction. The first output is 0, etc.
   */
  readonly outputIndex: number;
}
