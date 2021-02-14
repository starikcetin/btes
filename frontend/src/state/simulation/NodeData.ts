import { SimulationLog } from './SimulationLog';

export interface NodeData {
  // synced state
  nodeUid: string;
  positionX: number;
  positionY: number;
  connectedNodeUids: string[];

  // local-only state
  readonly logs: SimulationLog[];
}
