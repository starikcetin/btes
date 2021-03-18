export interface BlocksRemovedFromOrphanageActionPayload {
  readonly simulationUid: string;
  readonly nodeUid: string;
  readonly removedBlockHashes: string[];
}
