import { SimulationNodeUnicastMailPayload } from '../../common/socketPayloads/SimulationNodeUnicastMailPayload';
import { SimulationNodeMail } from '../../common/SimulationNodeMail';
import { Simulation } from '../Simulation';
import { SimulationCommand } from '../SimulationCommand';
import { mailUidGenerator } from '../../utils/uidGenerators';

export class SimulationNodeUnicastMailCommand implements SimulationCommand {
  private readonly simulation: Simulation;
  private readonly eventPayload: SimulationNodeUnicastMailPayload;

  constructor(
    simulation: Simulation,
    eventPayload: SimulationNodeUnicastMailPayload
  ) {
    this.simulation = simulation;
    this.eventPayload = eventPayload;
  }

  public readonly execute = (): void => {
    const mail: SimulationNodeMail = {
      mailUid: mailUidGenerator.next().toString(),
      body: this.eventPayload.mailBody,
      originNodeUid: this.eventPayload.senderNodeUid,
    };

    const senderNode = this.simulation.nodeMap[this.eventPayload.senderNodeUid];
    const recipientNode = this.simulation.nodeMap[
      this.eventPayload.recipientNodeUid
    ];

    senderNode.sendUnicastMail(recipientNode, mail);
  };
}
