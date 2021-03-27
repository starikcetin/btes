import { useCallback } from 'react';

import { BlockchainTx } from '../../../../common/blockchain/tx/BlockchainTx';
import { BlockchainTxOutPoint } from '../../../../common/blockchain/tx/BlockchainTxOutPoint';
import { BlockchainTxOutput } from '../../../../../../backend/src/common/blockchain/tx/BlockchainTxOutput';
import { useTxGetter } from './useTxGetter';

export type TxOutputGetResult =
  | {
      place: 'nowhere';
    }
  | {
      place:
        | 'main-branch'
        | 'side-branch'
        | 'block-orphanage'
        | 'mempool'
        | 'tx-orphanage';
      tx: BlockchainTx;
      output: BlockchainTxOutput | null;
    };

/** Returns a function that selects from redux the output that the given outPoint is referencing. */
export const useTxOutputGetter = (
  txGetter: ReturnType<typeof useTxGetter>
): ((outPoint: BlockchainTxOutPoint) => TxOutputGetResult) => {
  return useCallback(
    (outPoint) => {
      const txGetterResult = txGetter(outPoint.txHash);
      return txGetterResult.place === 'nowhere'
        ? txGetterResult
        : {
            ...txGetterResult,
            output: txGetterResult.tx.outputs[outPoint.outputIndex] ?? null,
          };
    },
    [txGetter]
  );
};
