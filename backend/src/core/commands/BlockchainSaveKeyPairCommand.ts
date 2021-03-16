import { Simulation } from '../Simulation';
import { SimulationCommand } from '../SimulationCommand';
import { BlockchainSaveKeyPairPayload } from '../../common/socketPayloads/BlockchainSaveKeyPairPayload';

export class BlockchainSaveKeyPairCommand implements SimulationCommand {
  private readonly simulation: Simulation;
  private readonly eventPayload: BlockchainSaveKeyPairPayload;

  constructor(
    simulation: Simulation,
    eventPayload: BlockchainSaveKeyPairPayload
  ) {
    this.simulation = simulation;
    this.eventPayload = eventPayload;
  }

  public readonly execute = (): void => {
    this.simulation.nodeMap[
      this.eventPayload.nodeUid
    ].blockchainApp.wallet.saveKeyPair(this.eventPayload.keyPair);
  };
}
