export interface SimulationNodeCreatedPayload {
  simulationUid: string;
  nodeUid: string;
  positionX: number;
  positionY: number;
  connectedNodeUids: string[];
}
