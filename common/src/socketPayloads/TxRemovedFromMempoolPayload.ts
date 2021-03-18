export interface TxRemovedFromMempoolPayload {
  readonly nodeUid: string;
  readonly removedTxHash: string;
}
