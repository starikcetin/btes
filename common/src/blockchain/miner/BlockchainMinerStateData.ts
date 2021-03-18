import { BlockchainMiningTask } from './BlockchainMiningTask';
import { MiningAttempt } from './MiningAttempt';

export type BlockchainMinerState =
  | BlockchainMinerIdleState
  | BlockchainMinerWorkingState
  | BlockchainMinerStoppedState;

export interface BlockchainMinerIdleState {
  readonly state: 'idle';
}

export interface BlockchainMinerWorkingState {
  readonly state: 'working';
  readonly task: BlockchainMiningTask;
  readonly attemptCount: number;
  readonly recentAttempts: MiningAttempt[];
}

export interface BlockchainMinerStoppedState {
  readonly state: 'stopped';
  readonly task: BlockchainMiningTask;
  readonly stopReason: 'success' | 'aborted';
  readonly attemptCount: number;

  /** `null` if aborted before the very first attempt. */
  readonly finalAttempt: MiningAttempt | null;
}
