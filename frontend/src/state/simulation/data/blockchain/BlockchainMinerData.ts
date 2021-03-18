import { BlockchainMinerState } from '../../../../common/blockchain/miner/BlockchainMinerStateData';

export interface BlockchainMinerData {
  readonly currentState: BlockchainMinerState;
}
