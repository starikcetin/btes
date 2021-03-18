import _ from 'lodash';

import { BlockchainTx } from '../../../common/blockchain/tx/BlockchainTx';

export const sumOfOutputs = (tx: BlockchainTx): number => {
  return _.sumBy(tx.outputs, (o) => o.value);
};
