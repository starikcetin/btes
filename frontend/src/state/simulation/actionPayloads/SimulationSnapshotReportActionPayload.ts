import { SimulationSnapshot } from '../../../common/SimulationSnapshot';

export interface SimulationSnapshotReportActionPayload {
  simulationUid: string;
  snapshot: SimulationSnapshot;
}
