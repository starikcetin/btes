import { BlockchainTxInput } from '../../../common/blockchain/tx/BlockchainTxInput';

/** Creates and returns an empty tx input. String fields are empty string and number fields are 0. */
export const makeDefaultTxInput = (isCoinbase: boolean): BlockchainTxInput => {
  return isCoinbase
    ? {
        isCoinbase,
        coinbase: '',
      }
    : {
        isCoinbase,
        previousOutput: {
          txHash: '',
          outputIndex: 0,
        },
        unlockingScript: {
          publicKey: '',
          signature: '',
        },
      };
};
