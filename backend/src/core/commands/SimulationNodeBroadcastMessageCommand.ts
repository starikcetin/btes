import { SimulationNodeBroadcastMessagePayload } from '../../common/socketPayloads/SimulationNodeBroadcastMessagePayload';
import { SimulationNodeMessage } from '../../common/SimulationNodeMessage';
import { Simulation } from '../Simulation';
import { SimulationNamespaceListener } from '../SimulationNamespaceListener';
import { SimulationNode } from '../SimulationNode';
import { UndoubleAction } from '../undoRedo/UndoubleAction';

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
      recipientNode.receiveMessage(message);

      this.socketEventEmitter.sendSimulationNodeMessageSent({
        senderNodeUid: senderNode.nodeUid,
        recipientNodeUid: recipientNode.nodeUid,
        message,
      });

      // TODO: wait for latency here

      this.socketEventEmitter.sendSimulationNodeMessageReceived({
        senderNodeUid: senderNode.nodeUid,
        recipientNodeUid: recipientNode.nodeUid,
        message,
      });

      // contagious broadcast: recipients in turn broadcast to their own connected nodes.
      // this propagates the message through the mesh network, just like a real blockchain.
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
      messageUid: 'foo',
      body: this.eventPayload.messageBody,
    };

    this.perform();
  };

  public readonly redo = this.perform;

  public readonly undo = (): void => {
    throw new Error('Method not implemented.');
  };
}
