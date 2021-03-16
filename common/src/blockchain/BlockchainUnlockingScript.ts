/**
 * `scriptSig` = `signature script`
 * 1. Satisfies the conditions placed on the UTXO (unspent transaction output), unlocking it for spending.
 * 2. Computational Script for confirming transaction authorization.
 */
export interface BlockchainUnlockingScript {
  /** In base58 */
  publicKey: string;

  /** In base58 */
  signature: string;
}
