import { BlockchainTransactionOutPoint } from '../../../common/blockchain/BlockchainTransactionOutPoint';

export const areOutPointsEquivalent = (
  outPointA: BlockchainTransactionOutPoint,
  outPointB: BlockchainTransactionOutPoint
): boolean => {
  return (
    outPointA.txHash === outPointB.txHash &&
    outPointA.outputIndex === outPointB.outputIndex
  );
};
