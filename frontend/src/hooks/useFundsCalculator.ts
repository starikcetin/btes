import _ from 'lodash';
import { useCallback } from 'react';

import { BlockchainTxOutPoint } from '../common/blockchain/tx/BlockchainTxOutPoint';
import { TxOutputGetter } from './txGetters/TxOutputGetter';
import { TxGetPlace } from './txGetters/TxGetPlace';

export type FundsCalculator = (utxoSet: BlockchainTxOutPoint[]) => number;

/** NaN if any of the outpoints cannot be resolved to an output. */
export const useFundsCalculator = <TPlaces extends ReadonlyArray<TxGetPlace>>(
  outputGetter: TxOutputGetter<TPlaces>
): FundsCalculator => {
  return useCallback(
    (utxoSet: BlockchainTxOutPoint[]): number => {
      return _.sumBy(
        utxoSet,
        (o) => outputGetter(o)?.output?.value ?? Number.NaN
      );
    },
    [outputGetter]
  );
};
