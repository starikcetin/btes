import { BlockchainMinerSnapshot } from '../../../common/blockchain/snapshots/BlockchainMinerSnapshot';
import { BlockchainConfig } from '../../../common/blockchain/BlockchainConfig';
import { SimulationNamespaceEmitter } from '../../SimulationNamespaceEmitter';
import { BlockchainMinerState } from '../../../common/blockchain/miner/BlockchainMinerStateData';

export class BlockchainMiner {
  private readonly socketEmitter: SimulationNamespaceEmitter;
  private readonly nodeUid: string;
  private readonly config: BlockchainConfig;

  private currentState: BlockchainMinerState;

  constructor(
    socketEmitter: SimulationNamespaceEmitter,
    nodeUid: string,
    config: BlockchainConfig,
    state: BlockchainMinerState
  ) {
    this.socketEmitter = socketEmitter;
    this.nodeUid = nodeUid;
    this.config = config;

    /*
     * TODO: when we do the save/load simulation jobs, we should resume mining
     * here if the state was that way when we left off. we already have the nonce
     * in the `working` state.
     * ~~ Tarık, 2021-03-17
     */
    this.currentState = state;
  }

  private readonly updateState = (newState: BlockchainMinerState): void => {
    this.currentState = newState;

    this.socketEmitter.sendBlockchainMinerStateUpdated({
      nodeUid: this.nodeUid,
      newState,
    });
  };

  public readonly takeSnapshot = (): BlockchainMinerSnapshot => {
    return {
      currentState: this.currentState,
    };
  };
}
