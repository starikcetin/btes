import { useCallback } from 'react';

import { hasValue } from '../../common/utils/hasValue';
import { TxGetPlace } from './TxGetPlace';
import { TxGetter } from './TxGetter';
import { TxOutputGetter } from './TxOutputGetter';

/** Returns a function that selects from redux the output that the given outPoint is referencing. */
export const useTxOutputGetter = <TPlaces extends ReadonlyArray<TxGetPlace>>(
  txGetter: TxGetter<TPlaces>
): TxOutputGetter<TPlaces> => {
  return useCallback(
    (outPoint) => {
      const txGetterResult = txGetter(outPoint.txHash);
      return hasValue(txGetterResult)
        ? {
            ...txGetterResult,
            output: txGetterResult.tx.outputs[outPoint.outputIndex] ?? null,
          }
        : null;
    },
    [txGetter]
  );
};
