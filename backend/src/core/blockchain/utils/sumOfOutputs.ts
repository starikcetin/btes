import _ from 'lodash';

import { BlockchainTx } from '../../../common/blockchain/BlockchainTx';

export const sumOfOutputs = (tx: BlockchainTx): number => {
  return _.sumBy(tx.outputs, (o) => o.value);
};
