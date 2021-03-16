import { BlockchainMinerSnapshot } from '../../../common/blockchain/snapshots/BlockchainMinerSnapshot';
import { BlockchainConfig } from '../../../common/blockchain/BlockchainConfig';
import { SimulationNamespaceEmitter } from '../../SimulationNamespaceEmitter';

export class BlockchainMiner {
  private readonly socketEmitter: SimulationNamespaceEmitter;
  private readonly nodeUid: string;
  private readonly config: BlockchainConfig;

  constructor(
    socketEmitter: SimulationNamespaceEmitter,
    nodeUid: string,
    config: BlockchainConfig
  ) {
    this.socketEmitter = socketEmitter;
    this.nodeUid = nodeUid;
    this.config = config;
  }

  public readonly takeSnapshot = (): BlockchainMinerSnapshot => {
    return {};
  };
}
