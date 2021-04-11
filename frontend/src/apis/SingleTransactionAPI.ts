export interface Transaction {
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
  prev_out: PrevOut;
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
  addr: string;
}

export interface SpendingOutpoint2 {
  tx_index: number;
  n: number;
}

export const fetchSingleTransactionWithHash = async (
  transactionHash: string | null
) => {
  const url = `https://blockchain.info/rawtx/${transactionHash}?format=json&cors=true`;
  const data = await (await fetch(url)).json();
  return transactionHash ? data : null;
};
