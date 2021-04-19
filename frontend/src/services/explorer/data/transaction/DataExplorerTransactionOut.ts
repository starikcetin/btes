import { DataExplorerTransactionSpendingOutpoint2 } from './DataExplorerTransactionSpendingOutpoint2';

export interface DataExplorerTransactionOut {
  type: number;
  spent: boolean;
  value: number;
  spending_outpoints: DataExplorerTransactionSpendingOutpoint2[];
  n: number;
  tx_index: number;
  script: string;
  addr?: string;
}
