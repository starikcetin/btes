export interface SimulationData {
  uid: string;
  pongs: Array<{ pingDate: number; pongDate: number }>;
  nodes: Array<{ simulationUid: string; nodeUid: string; positionX: number; positionY: number }>;
}
