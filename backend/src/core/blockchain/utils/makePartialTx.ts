import { BlockchainRegularTx } from '../../../common/blockchain/tx/BlockchainTx';
import { BlockchainPartialRegularTx as BlockchainPartialRegularTx } from '../../../common/blockchain/tx/BlockchainPartialRegularTx';

/** Takes in a tx and returns a partial tx. */
export const makePartialTx = (
  tx: BlockchainRegularTx
): BlockchainPartialRegularTx => {
  return {
    outputs: tx.outputs,
    isCoinbase: tx.isCoinbase,
    inputs: tx.inputs.map((i) => ({ previousOutput: i.previousOutput })),
  };
};
