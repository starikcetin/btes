export interface TxsRemovedFromOrphanageActionPayload {
  readonly simulationUid: string;
  readonly nodeUid: string;
  readonly removedTxHashes: string[];
}
