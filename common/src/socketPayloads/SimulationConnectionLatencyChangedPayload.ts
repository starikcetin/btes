export interface SimulationConnectionLatencyChangedPayload {
  firstNodeUid: string;
  secondNodeUid: string;
  latencyInMs: number;
}
