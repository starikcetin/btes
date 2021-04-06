export interface TokenTransfer {
  recipient_address: string;
  amount: string;
  memo: string;
}

export interface Principal {
  type_id: string;
  address: string;
}

export interface PostCondition {
  type: string;
  condition_code: string;
  amount: string;
  principal: Principal;
}

export interface ContractCall {
  contract_id: string;
  function_name: string;
}

export interface Tx {
  tx_id: string;
  tx_status: string;
  tx_type: string;
  receipt_time: number;
  receipt_time_iso: string;
  nonce: number;
  fee_rate: string;
  sender_address: string;
  sponsored: boolean;
  post_condition_mode: string;
  token_transfer: TokenTransfer;
  post_conditions: PostCondition[];
  contract_call: ContractCall;
}

export const fetchTransactionList = async () => {
  const url = 'https://stacks-node-api.mainnet.stacks.co/extended/v1/tx';
  const data = await (await fetch(url)).json();
  return data.results;
};
