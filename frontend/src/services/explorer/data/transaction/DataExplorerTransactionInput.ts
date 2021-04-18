import { DataExplorerTransactionPrevOut } from './DataExplorerTransactionPrevOut';

export interface DataExplorerTransactionInput {
  sequence: number;
  witness: string;
  script: string;
  index?: number;
  prev_out: DataExplorerTransactionPrevOut;
}
