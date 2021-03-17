import { BlockchainStartMiningPayload } from '../../common/socketPayloads/BlockchainStartMiningPayload';
import { Simulation } from '../Simulation';
import { SimulationCommand } from '../SimulationCommand';

export class BlockchainStartMiningCommand implements SimulationCommand {
  private readonly simulation: Simulation;
  private readonly eventPayload: BlockchainStartMiningPayload;

  constructor(
    simulation: Simulation,
    eventPayload: BlockchainStartMiningPayload
  ) {
    this.simulation = simulation;
    this.eventPayload = eventPayload;
  }

  public readonly execute = (): void => {
    this.simulation.nodeMap[
      this.eventPayload.nodeUid
    ].blockchainApp.miner.startMining(this.eventPayload.miningTask);
  };
}
