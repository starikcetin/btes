import { BlockchainTx } from '../common/blockchain/tx/BlockchainTx';
import { useCallback } from 'react';
import { TxOutputSumCalculator } from './useTxOutputSumCalculator';
import { TxInputSumCalculator } from './useTxInputSumCalculator';

export type TxFeeCalculator = (tx: BlockchainTx) => number;

/** NaN if any of the outpoints cannot be resolved to an output. */
export const useTxFeeCalculator = (
  inputSumCalculator: TxInputSumCalculator,
  outputSumCalculator: TxOutputSumCalculator
): TxFeeCalculator => {
  return useCallback(
    (tx: BlockchainTx): number => {
      const { inputs, outputs } = tx;
      const inputSum = inputSumCalculator(inputs);
      const outputSum = outputSumCalculator(outputs);
      return inputSum - outputSum;
    },
    [inputSumCalculator, outputSumCalculator]
  );
};
