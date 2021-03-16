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
  readonly hashCount: number;
  readonly recentAttempts: MiningAttempt[];
}

export interface BlockchainMinerStoppedState {
  readonly state: 'stopped';
  readonly stopReason: 'success' | 'received-block' | 'cancelled';
  readonly hashCount: number;
  readonly finalAttempt: MiningAttempt;
}
