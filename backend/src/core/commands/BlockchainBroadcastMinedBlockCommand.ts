import { BlockchainBroadcastMinedBlockPayload } from '../../common/socketPayloads/BlockchainBroadcastMinedBlockPayload';
import { Simulation } from '../Simulation';
import { SimulationCommand } from '../SimulationCommand';

export class BlockchainBroadcastMinedBlockCommand implements SimulationCommand {
  private readonly simulation: Simulation;
  private readonly eventPayload: BlockchainBroadcastMinedBlockPayload;

  constructor(
    simulation: Simulation,
    eventPayload: BlockchainBroadcastMinedBlockPayload
  ) {
    this.simulation = simulation;
    this.eventPayload = eventPayload;
  }

  public readonly execute = (): void => {
    const { blockchainApp } = this.simulation.nodeMap[
      this.eventPayload.nodeUid
    ];

    const minedBock = blockchainApp.miner.assembleMinedBlock();
    blockchainApp.miner.dismissStoppedState();
    blockchainApp.receiveBlock(minedBock);
  };
}
