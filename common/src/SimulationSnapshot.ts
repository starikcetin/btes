import { SimulationNodeSnapshot } from './SimulationNodeSnapshot';
import { NodeConnectionMapSnapshot } from './NodeConnectionMapSnapshot';
import { ControlledTimerServiceSnapshot } from './ControlledTimerServiceSnapshot';
import { BlockchainConfig } from './blockchain/BlockchainConfig';

export interface SimulationSnapshot {
  readonly simulationUid: string;
  readonly nodeMap: { [nodeUid: string]: SimulationNodeSnapshot };
  readonly connectionMap: NodeConnectionMapSnapshot;
  readonly timerService: ControlledTimerServiceSnapshot;
  readonly blockchainConfig: BlockchainConfig;
}
