import { SimulationNodeUnicastMailPayload } from '../../common/socketPayloads/SimulationNodeUnicastMailPayload';
import { SimulationNodeMail } from '../../common/SimulationNodeMail';
import { Simulation } from '../Simulation';
import { SimulationNamespaceEmitter } from '../SimulationNamespaceEmitter';
import { SimulationNode } from '../SimulationNode';
import { SimulationCommand } from '../SimulationCommand';
import { mailUidGenerator } from '../../utils/uidGenerators';

export class SimulationNodeUnicastMailCommand implements SimulationCommand {
  private readonly simulation: Simulation;
  private readonly socketEventEmitter: SimulationNamespaceEmitter;
  private readonly eventPayload: SimulationNodeUnicastMailPayload;

  private mail: SimulationNodeMail | undefined;

  constructor(
    simulation: Simulation,
    socketEventEmitter: SimulationNamespaceEmitter,
    eventPayload: SimulationNodeUnicastMailPayload
  ) {
    this.simulation = simulation;
    this.socketEventEmitter = socketEventEmitter;
    this.eventPayload = eventPayload;
  }

  private readonly unicast = (
    senderNode: SimulationNode,
    recipientNode: SimulationNode,
    mail: SimulationNodeMail
  ) => {
    this.socketEventEmitter.sendSimulationNodeMailSent({
      senderNodeUid: senderNode.nodeUid,
      recipientNodeUid: recipientNode.nodeUid,
      mail,
    });

    // TODO: wait for latency here

    recipientNode.recordMail(mail);
    this.socketEventEmitter.sendSimulationNodeMailReceived({
      senderNodeUid: senderNode.nodeUid,
      recipientNodeUid: recipientNode.nodeUid,
      mail,
    });
  };

  private readonly perform = () => {
    if (!this.mail) {
      throw new Error('perform is called before execute!');
    }

    const senderNode = this.simulation.nodeMap[this.eventPayload.senderNodeUid];
    const recipientNode = this.simulation.nodeMap[
      this.eventPayload.recipientNodeUid
    ];

    this.unicast(senderNode, recipientNode, this.mail);
  };

  public readonly execute = (): void => {
    this.mail = {
      mailUid: mailUidGenerator.next().toString(),
      body: this.eventPayload.mailBody,
      originNodeUid: this.eventPayload.senderNodeUid,
    };

    this.perform();
  };
}
