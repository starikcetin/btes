import { SimulationNodeSnapshot } from '../../../common/SimulationNodeSnapshot';

export interface SimulationNodeCreatedActionPayload {
  simulationUid: string;
  nodeUid: string;
  nodeSnapshot: SimulationNodeSnapshot;
}
