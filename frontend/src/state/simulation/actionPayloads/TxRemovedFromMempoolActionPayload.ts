export interface TxRemovedFromMempoolActionPayload {
  readonly simulationUid: string;
  readonly nodeUid: string;
  readonly removedTxHash: string;
}
