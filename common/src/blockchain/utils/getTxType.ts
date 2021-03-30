import { BlockchainTx } from '../tx/BlockchainTx';

/**
 * Returns whether the given `tx` is coinbase or regular.
 *
 * The `invalid` result is not an exhaustive check! It just means the
 * given `tx` is malformed, and therefore cannot be determined as either
 * coinbase or regular.
 */
export const getTxType = (
  tx: BlockchainTx
): 'coinbase' | 'regular' | 'invalid' => {
  if (tx.inputs.length === 0) {
    return 'invalid'; // input list is empty, invalid.
  } else if (tx.inputs.length === 1) {
    if (tx.inputs[0].isCoinbase) {
      return 'coinbase'; // only one input, and it is coinbase.
    } else {
      return 'regular'; // only one input, but it is not coinbase.
    }
  } else {
    if (tx.inputs.some((i) => i.isCoinbase)) {
      return 'invalid'; // multiple inputs, at least one is coinbase. invalid.
    } else {
      return 'regular'; // multiple inputs, none are coinbase.
    }
  }
};
