import { BlockchainTransactionInput } from './BlockchainTransactionInput';
import { BlockchainTransactionOutput } from './BlockchainTransactionOutput';

export interface BlockchainTransaction {
  /*
   * Omitted fields:
   * - version (number): A version number to track software/protocol upgrades
   * - locktime (number): A specified locktime indicates that the transaction is only valid at the given blockheight or later.
   */

  /**
   * vin
   */
  readonly inputs: BlockchainTransactionInput[];

  /**
   * vout
   */
  readonly outputs: BlockchainTransactionOutput[];
}
