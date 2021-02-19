import { NodeConnectionMapData } from './ConnectionMapData';
import { NodeData } from './NodeData';
import { SimulationLog } from './SimulationLog';

export interface SimulationData {
  // synced state
  readonly simulationUid: string;
  readonly nodeMap: { [nodeUid: string]: NodeData };
  readonly connectionMap: NodeConnectionMapData;

  // local-only state
  readonly pongs: Array<{ pingDate: number; pongDate: number }>;
  readonly logs: SimulationLog[];
}
