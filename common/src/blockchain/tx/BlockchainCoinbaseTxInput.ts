/**
 * * https://en.bitcoin.it/wiki/Coinbase
 * * This is the input of a coinbase transaction.
 */
export interface BlockchainCoinbaseTxInput {
  /** Arbitrary data */
  readonly coinbase: string;
}
