import { SimulationNodeSnapshot } from '../common/SimulationNodeSnapshot';

export class SimulationNode {
  public readonly nodeUid: string;
  public readonly positionX: number;
  public readonly positionY: number;

  constructor(nodeUid: string, positionX: number, positionY: number) {
    this.nodeUid = nodeUid;
    this.positionX = positionX;
    this.positionY = positionY;
  }

  public readonly teardown = (): void => {
    // no-op for now
  };

  public readonly takeSnapshot = (): SimulationNodeSnapshot => {
    return {
      nodeUid: this.nodeUid,
      positionX: this.positionX,
      positionY: this.positionY,
    };
  };
}
