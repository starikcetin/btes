export interface SimulationNodeCreatedActionPayload {
  simulationUid: string;
  nodeUid: string;
  positionX: number;
  positionY: number;
  connectedNodeUids: string[];
}
