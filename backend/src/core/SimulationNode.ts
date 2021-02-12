import { SimulationNodeSnapshot } from '../common/SimulationNodeSnapshot';
import { SimulationNodeMessage } from '../common/SimulationNodeMessage';

export class SimulationNode {
  public readonly nodeUid: string;

  private _positionX: number;
  public get positionX(): number {
    return this._positionX;
  }

  private _positionY: number;
  public get positionY(): number {
    return this._positionY;
  }

  private _connectedNodes: SimulationNode[];
  public get connectedNodes(): ReadonlyArray<SimulationNode> {
    return [...this._connectedNodes];
  }

  private _receivedMessages: SimulationNodeMessage[];
  public get receivedMessages(): ReadonlyArray<SimulationNodeMessage> {
    return [...this._receivedMessages];
  }

  constructor(
    nodeUid: string,
    positionX: number,
    positionY: number,
    connectedNodeUids: ReadonlyArray<SimulationNode>,
    receivedMessages: ReadonlyArray<SimulationNodeMessage>
  ) {
    this.nodeUid = nodeUid;
    this._positionX = positionX;
    this._positionY = positionY;
    this._connectedNodes = [...connectedNodeUids];
    this._receivedMessages = [...receivedMessages];
  }

  public readonly teardown = (): void => {
    // no-op for now
  };

  public readonly updatePosition = (x: number, y: number): void => {
    this._positionX = x;
    this._positionY = y;
  };

  public readonly receiveMessage = (message: SimulationNodeMessage): void => {
    this._receivedMessages.push(message);
  };

  /** Returns connected nodes that don't have this message received already. */
  public readonly advertiseMessage = (
    message: SimulationNodeMessage
  ): ReadonlyArray<SimulationNode> => {
    return this._connectedNodes.filter((node) => node.hasMessage(message));
  };

  public readonly hasMessage = (message: SimulationNodeMessage): boolean => {
    return this._receivedMessages.some(
      (m) => m.messageUid === message.messageUid
    );
  };

  public readonly takeSnapshot = (): SimulationNodeSnapshot => {
    return {
      nodeUid: this.nodeUid,
      positionX: this._positionX,
      positionY: this._positionY,
      connectedNodeUids: this._connectedNodes.map((node) => node.nodeUid),
      receivedMessages: [...this._receivedMessages],
    };
  };
}
