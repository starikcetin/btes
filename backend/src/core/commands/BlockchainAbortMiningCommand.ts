import { BlockchainAbortMiningPayload } from '../../common/socketPayloads/BlockchainAbortMiningPayload';
import { Simulation } from '../Simulation';
import { SimulationCommand } from '../SimulationCommand';

export class BlockchainAbortMiningCommand implements SimulationCommand {
  private readonly simulation: Simulation;
  private readonly eventPayload: BlockchainAbortMiningPayload;

  constructor(
    simulation: Simulation,
    eventPayload: BlockchainAbortMiningPayload
  ) {
    this.simulation = simulation;
    this.eventPayload = eventPayload;
  }

  public readonly execute = (): void => {
    this.simulation.nodeMap[
      this.eventPayload.nodeUid
    ].blockchainApp.miner.abortMining();
  };
}
