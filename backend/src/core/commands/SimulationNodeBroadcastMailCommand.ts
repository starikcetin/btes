import { SimulationNodeBroadcastMailPayload } from '../../common/socketPayloads/SimulationNodeBroadcastMailPayload';
import { SimulationNodeMail } from '../../common/SimulationNodeMail';
import { Simulation } from '../Simulation';
import { SimulationNamespaceListener } from '../SimulationNamespaceListener';
import { SimulationNode } from '../SimulationNode';
import { UndoubleAction } from '../undoRedo/UndoubleAction';
import { mailUidGenerator } from '../../utils/uidGenerators';

export class SimulationNodeBroadcastMailCommand implements UndoubleAction {
  private readonly simulation: Simulation;
  private readonly socketEventEmitter: SimulationNamespaceListener;
  private readonly eventPayload: SimulationNodeBroadcastMailPayload;

  private mail: SimulationNodeMail | undefined;

  constructor(
    simulation: Simulation,
    socketEventEmitter: SimulationNamespaceListener,
    eventPayload: SimulationNodeBroadcastMailPayload
  ) {
    this.simulation = simulation;
    this.socketEventEmitter = socketEventEmitter;
    this.eventPayload = eventPayload;
  }

  private readonly broadcast = (
    senderNode: SimulationNode,
    mail: SimulationNodeMail
  ) => {
    const recipientNodes = senderNode.advertiseMail(mail);

    recipientNodes.forEach((recipientNode) => {
      this.socketEventEmitter.sendSimulationNodeMailSent({
        senderNodeUid: senderNode.nodeUid,
        recipientNodeUid: recipientNode.nodeUid,
        mail,
      });

      // TODO: wait for latency here

      recipientNode.recordReceivedMail(mail);
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
    });
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
