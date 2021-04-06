/**
 * * https://en.bitcoin.it/wiki/Coinbase
 * * This is the input of a coinbase transaction.
 */
export interface BlockchainCoinbaseTxInput {
  /**
   * Indicates if this input is coinbase.
   * Not in the actual protocol, intended for ease of development.
   */
  readonly isCoinbase: true;

  /** Arbitrary data */
  readonly coinbase: string;
}
