export interface MiningAttempt {
  readonly isSuccess: boolean;
  /** In `hhashing. */
  readonly hash: string;
  readonly nonce: number;
  readonly timestamp: number;
}
