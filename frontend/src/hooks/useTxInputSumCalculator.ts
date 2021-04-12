import _ from 'lodash';
import { useCallback } from 'react';

import { hasValue } from '../common/utils/hasValue';
import { TxGetPlace } from './txGetters/TxGetPlace';
import { TxOutputGetter } from './txGetters/TxOutputGetter';
import { BlockchainTxInput } from '../common/blockchain/tx/BlockchainTxInput';

export type TxInputSumCalculator = (inputs: BlockchainTxInput[]) => number;

/** NaN if any of the outpoints cannot be resolved to an output. */
export const useTxInputSumCalculator = <
  TPlaces extends ReadonlyArray<TxGetPlace>
>(
  outputGetter: TxOutputGetter<TPlaces>
): TxInputSumCalculator => {
  return useCallback(
    (inputs: BlockchainTxInput[]): number => {
      return _.sumBy(inputs, (i) => {
        if (i.isCoinbase) {
          return 0;
        }

        const getResult = outputGetter(i.previousOutput);
        return hasValue(getResult) && hasValue(getResult.output)
          ? getResult.output.value
          : Number.NaN;
      });
    },
    [outputGetter]
  );
};
