import { BlockchainBroadcastTxPayload } from '../../common/socketPayloads/BlockchainBroadcastTxPayload';
import { Simulation } from '../Simulation';
import { SimulationCommand } from '../SimulationCommand';

export class BlockchainBroadcastTxCommand implements SimulationCommand {
  private readonly simulation: Simulation;
  private readonly eventPayload: BlockchainBroadcastTxPayload;

  constructor(
    simulation: Simulation,
    eventPayload: BlockchainBroadcastTxPayload
  ) {
    this.simulation = simulation;
    this.eventPayload = eventPayload;
  }

  public readonly execute = (): void => {
    this.simulation.nodeMap[
      this.eventPayload.nodeUid
    ].blockchainApp.wallet.broadcastTx(this.eventPayload.tx);
  };
}
