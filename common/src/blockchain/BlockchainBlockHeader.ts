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
   * `bits`
   * The Proof-of-Work algorithm difficulty target for this block
   */
  readonly difficultyTarget: number;

  /**
   * A counter used for the Proof-of-Work algorithm
   */
  readonly nonce: number;
}
