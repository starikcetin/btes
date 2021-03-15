import { BlockchainTxOutPoint } from '../../../common/blockchain/BlockchainTxOutPoint';

export const areOutPointsEqual = (
  a: BlockchainTxOutPoint,
  b: BlockchainTxOutPoint
): boolean => {
  return a.txHash === b.txHash && a.outputIndex === b.outputIndex;
};
