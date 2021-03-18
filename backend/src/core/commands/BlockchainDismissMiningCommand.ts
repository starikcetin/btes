import { BlockchainDismissMiningPayload } from '../../common/socketPayloads/BlockchainDismissMiningPayload';
import { Simulation } from '../Simulation';
import { SimulationCommand } from '../SimulationCommand';

export class BlockchainDismissMiningCommand implements SimulationCommand {
  private readonly simulation: Simulation;
  private readonly eventPayload: BlockchainDismissMiningPayload;

  constructor(
    simulation: Simulation,
    eventPayload: BlockchainDismissMiningPayload
  ) {
    this.simulation = simulation;
    this.eventPayload = eventPayload;
  }

  public readonly execute = (): void => {
    this.simulation.nodeMap[
      this.eventPayload.nodeUid
    ].blockchainApp.miner.dismissStoppedState();
  };
}
