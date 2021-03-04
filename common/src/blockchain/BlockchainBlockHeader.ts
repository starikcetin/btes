/** https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch09.asciidoc#block-header */
export interface BlockchainBlockHeader {
  // TODO: we can get away with not implementing this
  /**
   * A version number to track software/protocol upgrades
   */
  readonly version: number;

  /**
   * A reference to the hash of the previous (parent) block in the chain
   */
  readonly previousHash: string;

  // TODO: we can get away with not implementing this
  /**
   * A hash of the root of the merkle tree of this block’s transactions
   */
  readonly merkleRoot: string;

  /**
   * The approximate creation time of this block (seconds from Unix Epoch)
   */
  readonly timestamp: number;

  /**
   * The Proof-of-Work algorithm difficulty target for this block
   */
  readonly difficultyTarget: number;

  /**
   * A counter used for the Proof-of-Work algorithm
   */
  readonly nonce: number;
}
