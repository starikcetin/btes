export interface NodeConnectionSnapshot {
  readonly firstNodeUid: string;
  readonly secondNodeUid: string;
  readonly latencyInMs: number;
}
