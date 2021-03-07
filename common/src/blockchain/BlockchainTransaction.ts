import { BlockchainTransactionInput } from './BlockchainTransactionInput';
import { BlockchainTransactionOutput } from './BlockchainTransactionOutput';

/**
 * https://en.bitcoin.it/wiki/Protocol_documentation#tx
 */
export interface BlockchainTransaction {
  /*
   * Omitted fields:
   * - version (number): Transaction data format version
   * - flag (flags): If present, always 0001, and indicates the presence of witness data
   * - tx_witnesses (witness array): A list of witnesses, one for each input; omitted if flag is omitted above
   * - locktime (number): The block number or timestamp at which this transaction is unlocked
   *
   * Implied fields:
   * - tx_in count (number) = inputs.length
   * - tx_out count (number) = outputs.length
   */

  /**
   * `tx_in`
   */
  readonly inputs: BlockchainTransactionInput[];

  /**
   * `tx_out`
   */
  readonly outputs: BlockchainTransactionOutput[];

  /**
   * Indicates if this transaction is coinbase.
   * Not in the actual protocol, intended for ease of development.
   */
  readonly isCoinbase: boolean;
}
