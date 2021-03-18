export interface TxsRemovedFromOrphanagePayload {
  readonly nodeUid: string;
  readonly removedTxHashes: string[];
}
