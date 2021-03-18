import { BlockchainMiningTask } from '../blockchain/miner/BlockchainMiningTask';

export interface BlockchainStartMiningPayload {
  readonly nodeUid: string;
  readonly miningTask: BlockchainMiningTask;
}
