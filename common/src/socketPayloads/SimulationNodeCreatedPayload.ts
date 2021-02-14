export interface SimulationNodeCreatedPayload {
  nodeUid: string;
  positionX: number;
  positionY: number;
  connectedNodeUids: string[];
}
