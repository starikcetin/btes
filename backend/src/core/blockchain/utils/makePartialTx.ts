import { BlockchainRegularTx } from '../../../common/blockchain/BlockchainTx';
import { BlockchainPartialRegularTx as BlockchainPartialRegularTx } from '../../../common/blockchain/BlockchainPartialRegularTx';

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
