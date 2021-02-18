import { SimulationNode } from '../SimulationNode';

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
}
