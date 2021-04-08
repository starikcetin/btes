import _ from 'lodash';
import { useCallback } from 'react';

import { BlockchainTx } from '../common/blockchain/tx/BlockchainTx';
import { TxFeeCalculator } from './useTxFeeCalculator';

export type TxsTotalFeeCalculator = (txs: BlockchainTx[]) => number;

/** NaN if any of the outpoints cannot be resolved to an output. */
export const useTxsTotalFeeCalculator = (
  txFeeCalculator: TxFeeCalculator
): TxsTotalFeeCalculator => {
  return useCallback(
    (txs: BlockchainTx[]): number => {
      return _.sumBy(txs, txFeeCalculator);
    },
    [txFeeCalculator]
  );
};
