import { NodeConnectionSnapshot } from '../NodeConnectionSnapshot';

export interface SimulationNodesConnectedPayload {
  firstNodeUid: string;
  secondNodeUid: string;
  connectionSnapshot: NodeConnectionSnapshot;
}
