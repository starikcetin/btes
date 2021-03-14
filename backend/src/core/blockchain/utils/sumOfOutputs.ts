import _ from 'lodash';

import { BlockchainTransaction } from '../../../common/blockchain/BlockchainTransaction';

export const sumOfOutputs = (tx: BlockchainTransaction): number => {
  return _.sumBy(tx.outputs, (o) => o.value);
};
