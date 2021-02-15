import { SimulationNodeUnicastMessagePayload } from '../../common/socketPayloads/SimulationNodeUnicastMessagePayload';
import { SimulationNodeMessage } from '../../common/SimulationNodeMessage';
import { Simulation } from '../Simulation';
import { SimulationNamespaceListener } from '../SimulationNamespaceListener';
import { SimulationNode } from '../SimulationNode';
import { UndoubleAction } from '../undoRedo/UndoubleAction';
import { messageUidGenerator } from '../../utils/uidGenerators';

export class SimulationNodeUnicastMessageCommand implements UndoubleAction {
  private readonly simulation: Simulation;
  private readonly socketEventEmitter: SimulationNamespaceListener;
  private readonly eventPayload: SimulationNodeUnicastMessagePayload;

  private message: SimulationNodeMessage | undefined;

  constructor(
    simulation: Simulation,
    socketEventEmitter: SimulationNamespaceListener,
    eventPayload: SimulationNodeUnicastMessagePayload
  ) {
    this.simulation = simulation;
    this.socketEventEmitter = socketEventEmitter;
    this.eventPayload = eventPayload;
  }

  private readonly unicast = (
    senderNode: SimulationNode,
    recipientNode: SimulationNode,
    message: SimulationNodeMessage
  ) => {
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
  };

  private readonly perform = () => {
    if (!this.message) {
      throw new Error('perform is called before execute!');
    }

    const senderNode = this.simulation.nodeMap[this.eventPayload.senderNodeUid];
    const recipientNode = this.simulation.nodeMap[
      this.eventPayload.recipientNodeUid
    ];

    this.unicast(senderNode, recipientNode, this.message);
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
    // todo: undo unicast message
    throw new Error('Method not implemented.');
  };
}
