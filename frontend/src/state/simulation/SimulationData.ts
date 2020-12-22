import { NodeData } from './NodeData';

export interface SimulationData {
  uid: string;
  pongs: Array<{ pingDate: number; pongDate: number }>;
  nodes: { [nodeUid: string]: NodeData };
}
