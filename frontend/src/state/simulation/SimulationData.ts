import { NodeData } from './NodeData';

export interface SimulationData {
  simulationUid: string;
  pongs: Array<{ pingDate: number; pongDate: number }>;
  nodeMap: { [nodeUid: string]: NodeData };
}
