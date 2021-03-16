import { BlockchainLockingScript } from '../crypto/BlockchainLockingScript';

/**
 * https://en.bitcoin.it/wiki/Protocol_documentation#tx
 * https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch06.asciidoc#transaction-outputs
 */
export interface BlockchainTxOutput {
  /*
   * Implied fields:
   * - pk_script length (number) = Length of the lockingScript
   */

  /**
   * In satoshis
   */
  readonly value: number;

  /**
   * `scriptPubKey` = `pk_script`
   * Usually contains the public key as a Bitcoin script setting up conditions to claim this output.
   */
  readonly lockingScript: BlockchainLockingScript;
}
