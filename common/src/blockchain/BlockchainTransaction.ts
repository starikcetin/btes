import { BlockchainTransactionInput } from './BlockchainTransactionInput';
import { BlockchainTransactionOutput } from './BlockchainTransactionOutput';

export interface BlockchainTransaction {
  // TODO: We might get away with not implementing this.
  readonly version: number;

  // TODO: We might get away with not implementing this.
  readonly locktime: number;

  /**
   * vin
   */
  readonly inputs: BlockchainTransactionInput[];

  /**
   * vout
   */
  readonly outputs: BlockchainTransactionOutput[];
}
