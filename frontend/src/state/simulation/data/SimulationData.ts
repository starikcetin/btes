import { NodeConnectionMapData } from './ConnectionMapData';
import { ControlledTimerServiceData } from './ControlledTimerServiceData';
import { NodeData } from './NodeData';
import { SimulationLog } from './SimulationLog';

export interface SimulationData {
  // synced state
  readonly simulationUid: string;
  readonly nodeMap: { [nodeUid: string]: NodeData };
  readonly connectionMap: NodeConnectionMapData;
  readonly timerService: ControlledTimerServiceData;

  // local-only state
  readonly pongs: Array<{ pingDate: number; pongDate: number }>;
  readonly logs: SimulationLog[];
}
