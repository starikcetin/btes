import { BlockchainMinerState } from '../../../common/blockchain/miner/BlockchainMinerStateData';

export interface BlockchainMinerStateUpdatedActionPayload {
  readonly simulationUid: string;
  readonly nodeUid: string;
  readonly newState: BlockchainMinerState;
}
