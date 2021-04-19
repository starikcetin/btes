import { DataExplorerTransactionWithBalance } from '../transaction/DataExplorerTransactionWithBalance';

export interface DataExplorerAddressBalance {
  hash160: string;
  address: string;
  n_tx: number;
  n_unredeemed: number;
  total_received: number;
  total_sent: number;
  final_balance: number;
  txs: DataExplorerTransactionWithBalance[];
}
