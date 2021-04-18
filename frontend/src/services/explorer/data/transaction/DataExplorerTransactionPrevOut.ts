import { DataExplorerSpendingOutpoint } from './DataExplorerSpendingOutpoints';

export interface DataExplorerTransactionPrevOut {
  spent: boolean;
  script: string;
  spending_outpoints: DataExplorerSpendingOutpoint[];
  tx_index: number;
  value: number;
  addr: string;
  n: number;
  type: number;
}
