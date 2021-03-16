export interface MiningAttempt {
  /** Raw byte array. Make a `Buffer` before using via `Buffer.from`. */
  readonly blockHash: number[];
  readonly nonce: number;
}
