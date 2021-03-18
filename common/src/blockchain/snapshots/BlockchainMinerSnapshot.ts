import { BlockchainMinerState } from '../miner/BlockchainMinerStateData';

export interface BlockchainMinerSnapshot {
  readonly currentState: BlockchainMinerState;
}
