export interface SimulationConnectionLatencyChangedActionPayload {
  simulationUid: string;
  firstNodeUid: string;
  secondNodeUid: string;
  latencyInMs: number;
}
