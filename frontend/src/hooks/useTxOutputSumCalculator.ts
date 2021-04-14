import _ from 'lodash';
import { useCallback } from 'react';

import { BlockchainTxOutput } from '../common/blockchain/tx/BlockchainTxOutput';

export type TxOutputSumCalculator = (outputs: BlockchainTxOutput[]) => number;

export const useTxOutputSumCalculator = (): TxOutputSumCalculator => {
  return useCallback((outputs: BlockchainTxOutput[]): number => {
    return _.sumBy(outputs, (o) => o.value);
  }, []);
};
