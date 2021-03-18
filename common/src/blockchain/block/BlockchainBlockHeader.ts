/**
 * https://en.bitcoin.it/wiki/Protocol_documentation#Block_Headers
 * https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch09.asciidoc#block-header
 */
export interface BlockchainBlockHeader {
  /*
   * Omitted fields:
   * - version (number): A version number to track software/protocol upgrades
   * - merkleRoot (string): Hash of the root of the merkle tree of this block’s transactions
   * - txn_count (number): Number of transaction entries, this value is always 0
   *
   *
   * Alternatively implemented fields:
   *
   * - difficultyTarget = bits (number): https://en.bitcoin.it/wiki/Difficulty A packed representation for the actual hexadecimal target
   *   Replacement: leadingZeroCount
   */

  /**
   * `prev_block`
   * Hash of the previous (parent) block in the chain
   */
  readonly previousHash: string;

  /**
   * A timestamp recording when this block was created (seconds from Unix Epoch)
   */
  readonly timestamp: number;

  /**
   * * Intended as an easier to implement alternative for the `difficultyTarget` field in the real Bitcoin protocol.
   * * Rule: `countLeadingZeroes(headerHash) >= leadingZeroCount`
   */
  readonly leadingZeroCount: number;

  /**
   * A counter used for the Proof-of-Work algorithm
   */
  readonly nonce: number;
}
