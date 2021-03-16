/**
 * * Represents the result of a crypto operation.
 * * `byteArray` and `base64` representations are equivalent.
 */
export interface CryptoResult {
  /** Raw byte array representation. */
  readonly byteArray: Uint8Array;

  /** base64 encoded string representation. */
  readonly base64: string;
}
