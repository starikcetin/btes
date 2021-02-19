import { SimulationNodeSnapshot } from './SimulationNodeSnapshot';
import { NodeConnectionMapSnapshot } from './NodeConnectionMapSnapshot';

export interface SimulationSnapshot {
  readonly simulationUid: string;
  readonly nodeMap: { [nodeUid: string]: SimulationNodeSnapshot };
  readonly connectionMap: NodeConnectionMapSnapshot;
}
