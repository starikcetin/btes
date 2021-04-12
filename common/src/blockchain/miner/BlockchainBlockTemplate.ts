/**
 * * The description of a block used by miner while creating the real block
 * * In other words: ready-to-mine block
 */
export interface BlockchainBlockTemplate {
  readonly coinbase: string;
  readonly recipientAddress: string;
  readonly value: number;
  readonly previousHash: string;
  readonly difficultyTarget: number;
  readonly includedTxHashes: string[];

  // TODO: this should be calculated on the backend with the given includedTxHashes
  readonly includedTxsTotalFee: number;
}
