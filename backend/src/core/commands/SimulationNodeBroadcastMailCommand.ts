import { SimulationNodeBroadcastMailPayload } from '../../common/socketPayloads/SimulationNodeBroadcastMailPayload';
import { SimulationNodeMail } from '../../common/SimulationNodeMail';
import { Simulation } from '../Simulation';
import { mailUidGenerator } from '../../utils/uidGenerators';
import { SimulationCommand } from '../SimulationCommand';

export class SimulationNodeBroadcastMailCommand implements SimulationCommand {
  private readonly simulation: Simulation;
  private readonly eventPayload: SimulationNodeBroadcastMailPayload;

  private mail: SimulationNodeMail | undefined;

  constructor(
    simulation: Simulation,
    eventPayload: SimulationNodeBroadcastMailPayload
  ) {
    this.simulation = simulation;
    this.eventPayload = eventPayload;
  }

  public readonly execute = (): void => {
    this.mail = {
      mailUid: mailUidGenerator.next().toString(),
      body: this.eventPayload.mailBody,
      originNodeUid: this.eventPayload.senderNodeUid,
    };

    const senderNode = this.simulation.nodeMap[this.eventPayload.senderNodeUid];
    senderNode.sendBroadcastMail(this.mail);
  };
}
