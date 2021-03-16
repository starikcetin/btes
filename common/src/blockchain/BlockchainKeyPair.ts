/**
 * A public private key pair. All fields encoded with `base58`.
 */
export interface BlockchainKeyPair {
  /** Encoded `base58` */
  readonly privateKey: string;

  /**
   * Full public key.
   * Encoded `base58`.
   */
  readonly publicKey: string;

  /**
   * Public key hash.
   * Encoded `base58`.
   */
  readonly address: string;
}
