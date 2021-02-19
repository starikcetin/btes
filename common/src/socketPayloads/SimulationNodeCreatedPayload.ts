import { SimulationNodeSnapshot } from '../SimulationNodeSnapshot';

export interface SimulationNodeCreatedPayload {
  nodeUid: string;
  nodeSnapshot: SimulationNodeSnapshot;
}
