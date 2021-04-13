export interface AddressBalance {
  hash160: string;
  address: string;
  n_tx: number;
  n_unredeemed: number;
  total_received: number;
  total_sent: number;
  final_balance: number;
  txs: Tx[];
}

export interface Tx {
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
  result: number;
  balance: number;
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

export const fetchAddressDetail = async (address: string | null) => {
  if (address !== null) {
    const url = `https://blockchain.info/rawaddr/${address}`;
    const data = await (await fetch(url)).json();
    return address ? data : null;
  } else return null;
};
