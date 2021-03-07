/**
 * https://en.bitcoin.it/wiki/Protocol_documentation#tx
 */
export interface BlockchainTransactionOutPoint {
  /**
   * The hash of the referenced transaction.
   */
  readonly hash: string;

  /**
   * The index of the specific output in the transaction. The first output is 0, etc.
   */
  readonly index: number;
}
