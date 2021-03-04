import { BlockchainLockingScript } from './BlockchainLockingScript';

/**
 * https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch06.asciidoc#transaction-outputs
 */
export interface BlockchainTransactionOutput {
  /**
   * In satoshis
   */
  readonly value: number;

  /**
   * `scriptPubKey`
   */
  readonly lockingScript: BlockchainLockingScript;
}
