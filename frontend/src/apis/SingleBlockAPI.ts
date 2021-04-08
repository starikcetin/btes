export interface Block {
  hash: string;
  ver: number;
  prev_block: string;
  mrkl_root: string;
  time: number;
  bits: number;
  next_block: string[];
  fee: number;
  nonce: number;
  n_tx: number;
  size: number;
  block_index: number;
  main_chain: boolean;
  height: number;
  weight: number;
  tx: BlockTx[];
}

export interface BlockTx {
  hash: string;
  ver: number;
  vin_sz: number;
  vout_sz: number;
  size: number;
  weight: number;
  fee: number;
  relayed_by: string;
  lock_time: number;
  tx_index: number;
  double_spend: boolean;
  time: number;
  block_index: number;
  block_height: number;
  inputs: Input[];
  out: Out[];
}

export interface Input {
  sequence: number;
  witness: string;
  script: string;
  index: number;
  prev_out?: PrevOut;
}

export interface PrevOut {
  spent: boolean;
  script: string;
  spending_outpoints: SpendingOutpoint[];
  tx_index: number;
  value: number;
  addr: string;
  n: number;
  type: number;
}

export interface SpendingOutpoint {
  tx_index: number;
  n: number;
}

export interface Out {
  type: number;
  spent: boolean;
  value: number;
  spending_outpoints: SpendingOutpoint2[];
  n: number;
  tx_index: number;
  script: string;
  addr?: string;
}

export interface SpendingOutpoint2 {
  tx_index: number;
  n: number;
}

export const fetchSingleBlockWithHeight = async (height: number | null) => {
  console.log(height);
  const url = `https://blockchain.info/block-height/${height}?format=json&cors=true`;
  const data = await (await fetch(url)).json();
  return height ? data.blocks[0] : null;
};
