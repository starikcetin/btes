import { BlockchainTxOutput } from '../common/blockchain/tx/BlockchainTxOutput';

/** Creates and returns an empty tx output. String fields are empty string and number fields are 0. */
export const makeDefaultTxOutput = (): BlockchainTxOutput => ({
  value: 0,
  lockingScript: {
    address: '',
  },
});
