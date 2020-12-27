import { SimulationLog } from './SimulationLog';

export interface NodeData {
  // synced state
  nodeUid: string;
  positionX: number;
  positionY: number;

  // local-only state
  readonly logs: SimulationLog[];
}
