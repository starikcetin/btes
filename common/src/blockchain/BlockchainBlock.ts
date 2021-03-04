export interface BlockchainBlock {
  readonly hash: string;
  readonly children: BlockchainBlock[];
}
