import { BlockchainUnlockingScript } from './BlockchainUnlockingScript';

/**
 * https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch06.asciidoc#transaction-inputs
 */
export interface BlockchainTransactionInput {
  /**
   * `txid`.
   * A transaction ID, referencing the transaction that contains the UTXO being spent.
   */
  readonly outputSouceTransactionId: string;

  /**
   * `vout`.
   * An output index (vout), identifying which UTXO (unspent transaction output) from that transaction is referenced (first one is zero).
   */
  readonly outputIndex: number;

  /**
   * `scriptSig`.
   */
  readonly unlockingScript: BlockchainUnlockingScript;

  // TODO: We might get away with not implementing sequence numbers at all.
  /**
   * `sequence`
   * https://bitcoin.stackexchange.com/q/2025
   * > Currently, sequence numbers are mainly used for signaling RBF - replace-by-fee - that allows you to resend a transaction with a higher fee.
   */
  readonly sequenceNumber: number;
}
