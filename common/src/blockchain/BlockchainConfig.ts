export interface BlockchainConfig {
  readonly keypairBitLength: number;

  /** Aka block reward. In satoshis. */
  readonly blockCreationFee: number;

  /** Number of confirmations needed to be able to spend a coinbase output. */
  readonly coinbaseMaturity: number;

  /**
   * * The target `leadingZeroCount` for all blocks.
   * * Rule: `leadingZeroCount >= targetLeadingZeroCount`
   */
  readonly targetLeadingZeroCount: number;
}
