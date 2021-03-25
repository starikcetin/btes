import { BlockchainPartialTx } from '../../../common/blockchain/tx/BlockchainPartialTx';
import { BlockchainTx } from '../../../common/blockchain/tx/BlockchainTx';

/**
 * Takes in a tx and returns a partial tx. Namely:
 * - Converts regular inputs to partial regular inputs.
 * - Leaves coinbase inputs as-is.
 */
export const makePartialTx = (tx: BlockchainTx): BlockchainPartialTx => {
  return {
    outputs: tx.outputs,
    inputs: tx.inputs.map((i) =>
      i.isCoinbase
        ? i
        : { isCoinbase: i.isCoinbase, previousOutput: i.previousOutput }
    ),
  };
};
