import { SimulationNodeBroadcastMailPayload } from '../../common/socketPayloads/SimulationNodeBroadcastMailPayload';
import { SimulationNodeMail } from '../../common/SimulationNodeMail';
import { Simulation } from '../Simulation';
import { SimulationNamespaceEmitter } from '../SimulationNamespaceEmitter';
import { SimulationNode } from '../SimulationNode';
import { UndoubleAction } from '../undoRedo/UndoubleAction';
import { mailUidGenerator } from '../../utils/uidGenerators';

export class SimulationNodeBroadcastMailCommand implements UndoubleAction {
  private readonly simulation: Simulation;
  private readonly socketEventEmitter: SimulationNamespaceEmitter;
  private readonly eventPayload: SimulationNodeBroadcastMailPayload;

  private mail: SimulationNodeMail | undefined;

  constructor(
    simulation: Simulation,
    socketEventEmitter: SimulationNamespaceEmitter,
    eventPayload: SimulationNodeBroadcastMailPayload
  ) {
    this.simulation = simulation;
    this.socketEventEmitter = socketEventEmitter;
    this.eventPayload = eventPayload;
  }

  private readonly send = (
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

    // only record & propagate if we did not receive the mail before.
    const didReceiveMailBefore =
      recipientNode.nodeUid === mail.originNodeUid ||
      recipientNode.hasMail(mail);

    if (!didReceiveMailBefore) {
      recipientNode.recordMail(mail);
      this.socketEventEmitter.sendSimulationNodeMailReceived({
        senderNodeUid: senderNode.nodeUid,
        recipientNodeUid: recipientNode.nodeUid,
        mail,
      });

      // propagating broadcast: recipients in turn broadcast to their own connected nodes.
      // this propagates the mail through the mesh network, just like a real blockchain.
      // ---
      // TODO: make this optional in the socket event, so we can turn it off and step through
      // when we need to do so in the lessons.
      // Tarık, 2021-02-15 04:37
      this.broadcast(recipientNode, mail);
    }
  };

  private readonly broadcast = (
    senderNode: SimulationNode,
    mail: SimulationNodeMail
  ) => {
    // prepare network messages
    const recipientNodes = senderNode.connectedNodes;
    const senders = recipientNodes.map((recipientNode) =>
      this.send.bind(this, senderNode, recipientNode, mail)
    );

    // send network messages
    senders.forEach((sender) => sender.call(this));
  };

  private readonly perform = () => {
    if (!this.mail) {
      throw new Error('perform is called before execute!');
    }

    const senderNode = this.simulation.nodeMap[this.eventPayload.senderNodeUid];
    this.broadcast(senderNode, this.mail);
  };

  public readonly execute = (): void => {
    this.mail = {
      mailUid: mailUidGenerator.next().toString(),
      body: this.eventPayload.mailBody,
      originNodeUid: this.eventPayload.senderNodeUid,
    };

    this.perform();
  };

  public readonly redo = this.perform;

  public readonly undo = (): void => {
    // TODO: undo broadcast mail
    throw new Error('Method not implemented.');
  };
}
