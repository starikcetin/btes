import { SimulationNode } from '../SimulationNode';
import { NodeConnectionSnapshot } from '../../common/NodeConnectionSnapshot';
import { SimulationNamespaceEmitter } from '../SimulationNamespaceEmitter';

export class NodeConnection {
  private readonly socketEmitter: SimulationNamespaceEmitter;

  public readonly firstNode: SimulationNode;
  public readonly secondNode: SimulationNode;

  private _latencyInMs: number;
  public get latencyInMs(): number {
    return this._latencyInMs;
  }

  constructor(
    socketEmitter: SimulationNamespaceEmitter,
    firstNode: SimulationNode,
    secondNode: SimulationNode,
    latencyInMs: number
  ) {
    this.socketEmitter = socketEmitter;
    this.firstNode = firstNode;
    this.secondNode = secondNode;
    this._latencyInMs = latencyInMs;
  }

  public readonly setLatencyInMs = (ms: number): void => {
    this._latencyInMs = ms;

    this.socketEmitter.sendSimulationConnectionLatencyChanged({
      firstNodeUid: this.firstNode.nodeUid,
      secondNodeUid: this.secondNode.nodeUid,
      latencyInMs: this._latencyInMs,
    });
  };

  public getOtherNode = (nodeUid: string): SimulationNode =>
    nodeUid === this.firstNode.nodeUid ? this.secondNode : this.firstNode;

  public readonly takeSnapshot = (): NodeConnectionSnapshot => {
    return {
      firstNodeUid: this.firstNode.nodeUid,
      secondNodeUid: this.secondNode.nodeUid,
      latencyInMs: this._latencyInMs,
    };
  };
}
