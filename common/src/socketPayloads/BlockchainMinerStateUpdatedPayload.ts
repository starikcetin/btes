import { BlockchainMinerState } from '../blockchain/miner/BlockchainMinerStateData';

export interface BlockchainMinerStateUpdatedPayload {
  readonly nodeUid: string;
  readonly newState: BlockchainMinerState;
}
