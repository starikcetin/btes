import { SimulationNodeBroadcastMessagePayload } from '../../common/socketPayloads/SimulationNodeBroadcastMessagePayload';
import { SimulationNodeMessage } from '../../common/SimulationNodeMessage';
import { Simulation } from '../Simulation';
import { SimulationNamespaceListener } from '../SimulationNamespaceListener';
import { SimulationNode } from '../SimulationNode';
import { UndoubleAction } from '../undoRedo/UndoubleAction';
import { messageUidGenerator } from '../../utils/uidGenerators';

export class SimulationNodeBroadcastMessageCommand implements UndoubleAction {
  private readonly simulation: Simulation;
  private readonly socketEventEmitter: SimulationNamespaceListener;
  private readonly eventPayload: SimulationNodeBroadcastMessagePayload;

  private message: SimulationNodeMessage | undefined;

  constructor(
    simulation: Simulation,
    socketEventEmitter: SimulationNamespaceListener,
    eventPayload: SimulationNodeBroadcastMessagePayload
  ) {
    this.simulation = simulation;
    this.socketEventEmitter = socketEventEmitter;
    this.eventPayload = eventPayload;
  }

  private readonly broadcast = (
    senderNode: SimulationNode,
    message: SimulationNodeMessage
  ) => {
    const recipientNodes = senderNode.advertiseMessage(message);

    recipientNodes.forEach((recipientNode) => {
      this.socketEventEmitter.sendSimulationNodeMessageSent({
        senderNodeUid: senderNode.nodeUid,
        recipientNodeUid: recipientNode.nodeUid,
        message,
      });

      // TODO: wait for latency here

      recipientNode.recordReceivedMessage(message);
      this.socketEventEmitter.sendSimulationNodeMessageReceived({
        senderNodeUid: senderNode.nodeUid,
        recipientNodeUid: recipientNode.nodeUid,
        message,
      });

      // propagating broadcast: recipients in turn broadcast to their own connected nodes.
      // this propagates the message through the mesh network, just like a real blockchain.
      // ---
      // TODO: make this optional in the socket event, so we can turn it off and step through
      // when we need to do so in the lessons.
      // Tarık, 2021-02-15 04:37
      this.broadcast(recipientNode, message);
    });
  };

  private readonly perform = () => {
    if (!this.message) {
      throw new Error('perform is called before execute!');
    }

    const senderNode = this.simulation.nodeMap[this.eventPayload.senderNodeUid];
    this.broadcast(senderNode, this.message);
  };

  public readonly execute = (): void => {
    this.message = {
      messageUid: messageUidGenerator.next().toString(),
      body: this.eventPayload.messageBody,
      originNodeUid: this.eventPayload.senderNodeUid,
    };

    this.perform();
  };

  public readonly redo = this.perform;

  public readonly undo = (): void => {
    // TODO: undo broadcast message
    throw new Error('Method not implemented.');
  };
}
