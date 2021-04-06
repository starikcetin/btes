export interface SpendingOutpoint {
  tx_index: number;
  n: number;
}

export interface PrevOut {
  spent: boolean;
  spending_outpoints: SpendingOutpoint[];
  tx_index: number;
  type: number;
  addr: string;
  value: number;
  n: number;
  script: string;
}

export interface Input {
  sequence: any;
  witness: string;
  prev_out: PrevOut;
  script: string;
}

export interface SpendingOutpoint2 {
  tx_index: number;
  n: number;
}

export interface Out {
  spent: boolean;
  tx_index: number;
  type: number;
  addr: string;
  value: number;
  n: number;
  script: string;
  spending_outpoints: SpendingOutpoint2[];
}

export interface Tx {
  lock_time: number;
  ver: number;
  size: number;
  inputs: Input[];
  weight: number;
  time: number;
  tx_index: number;
  vin_sz: number;
  hash: string;
  vout_sz: number;
  relayed_by: string;
  out: Out[];
  rbf?: boolean;
}

export const fetchTransactionList = async () => {
  const url =
    'https://blockchain.info/unconfirmed-transactions?format=json&cors=true';
  const data = await (await fetch(url)).json();
  return data.txs;
};
