import { DataExplorerTransactionInput } from './DataExplorerTransactionInput';
import { DataExplorerTransactionOut } from './DataExplorerTransactionOut';

export interface DataExplorerUnconfirmedTransaction {
  lock_time: number;
  ver: number;
  size: number;
  inputs: DataExplorerTransactionInput[];
  weight: number;
  time: number;
  tx_index: number;
  vin_sz: number;
  hash: string;
  vout_sz: number;
  relayed_by: string;
  out: DataExplorerTransactionOut[];
  rbf?: boolean;
}
