export interface BlockList {
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

export const fetchBlockList = async () => {
  const url = `https://stacks-node-api.mainnet.stacks.co/extended/v1/block`;
  const data = await (await fetch(url)).json();
  return data.results;
};
