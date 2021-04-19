export interface DataExplorerBlock {
  canonical: boolean;
  height: number;
  hash: string;
  parent_block_hash: string;
  burn_block_time: number;
  burn_block_time_iso: Date;
  burn_block_hash: string;
  burn_block_height: number;
  miner_txid: string;
  txs: string[];
}
