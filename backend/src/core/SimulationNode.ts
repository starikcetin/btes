export class SimulationNode {
  public nodeUid: string;
  public positionX: number;
  public positionY: number;

  constructor(nodeUid: string, positionX: number, positionY: number) {
    this.nodeUid = nodeUid;
    this.positionX = positionX;
    this.positionY = positionY;
  }
}
