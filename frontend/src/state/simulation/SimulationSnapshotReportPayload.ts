import { SimulationSnapshot } from '../../common/SimulationSnapshot';

export interface SimulationSnapshotReportPayload {
  simulationUid: string;
  snapshot: SimulationSnapshot;
}
