import { DataExplorerTransactionInput } from './DataExplorerTransactionInput';
import { DataExplorerTransactionOut } from './DataExplorerTransactionOut';

export interface DataExplorerTransactionWithBalance {
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
  inputs: DataExplorerTransactionInput[];
  out: DataExplorerTransactionOut[];
  result: number;
  balance: number;
}
