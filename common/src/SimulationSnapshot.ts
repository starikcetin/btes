import { SimulationNodeSnapshot } from './SimulationNodeSnapshot';
import { NodeConnectionMapSnapshot } from './NodeConnectionMapSnapshot';
import { ControlledTimerServiceSnapshot } from './ControlledTimerServiceSnapshot';

export interface SimulationSnapshot {
  readonly simulationUid: string;
  readonly nodeMap: { [nodeUid: string]: SimulationNodeSnapshot };
  readonly connectionMap: NodeConnectionMapSnapshot;
  readonly timerService: ControlledTimerServiceSnapshot;
}
