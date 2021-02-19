import { NodeConnectionSnapshot } from '../../../common/NodeConnectionSnapshot';

export interface SimulationNodesConnectedActionPayload {
  simulationUid: string;
  firstNodeUid: string;
  secondNodeUid: string;
  connectionSnapshot: NodeConnectionSnapshot;
}
