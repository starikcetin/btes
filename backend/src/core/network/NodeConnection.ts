import { SimulationNode } from '../SimulationNode';
import { NodeConnectionSnapshot } from '../../common/NodeConnectionSnapshot';

export class NodeConnection {
  public readonly firstNode: SimulationNode;
  public readonly secondNode: SimulationNode;

  private _latencyInMs: number;
  public get latencyInMs(): number {
    return this._latencyInMs;
  }

  constructor(
    firstNode: SimulationNode,
    secondNode: SimulationNode,
    latencyInMs: number
  ) {
    this.firstNode = firstNode;
    this.secondNode = secondNode;
    this._latencyInMs = latencyInMs;
  }

  public readonly setLatencyInMs = (ms: number): void => {
    this._latencyInMs = ms;
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
