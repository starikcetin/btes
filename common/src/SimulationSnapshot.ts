import { SimulationNodeSnapshot } from './SimulationNodeSnapshot';

export interface SimulationSnapshot {
  readonly simulationUid: string;
  readonly nodeMap: { [nodeUid: string]: SimulationNodeSnapshot };
}
