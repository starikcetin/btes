export interface BlocksRemovedFromOrphanagePayload {
  readonly nodeUid: string;
  readonly removedBlockHashes: string[];
}
