import _ from 'lodash';
import { TxLookup } from '../data/blockchain/TxLookup';
import { hashTx } from '../../../common/blockchain/utils/hashTx';
import { BlockchainTx } from '../../../common/blockchain/tx/BlockchainTx';

export const makeTxLookupFromTxArray = (txArr: BlockchainTx[]): TxLookup => {
  return _.keyBy(txArr, hashTx);
};
