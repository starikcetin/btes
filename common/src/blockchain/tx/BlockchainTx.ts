import { BlockchainTxOutput } from './BlockchainTxOutput';
import { BlockchainTxInput } from './BlockchainTxInput';

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
 * * https://en.bitcoin.it/wiki/Protocol_documentation#tx
 * * https://en.bitcoin.it/wiki/Transaction#Generation
 */
export type BlockchainTx = {
  /**
   * `tx_in`
   */
  readonly inputs: BlockchainTxInput[];

  /**
   * `tx_out`
   */
  readonly outputs: BlockchainTxOutput[];
};
