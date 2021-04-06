import _ from 'lodash';
import { TxLookup } from '../data/blockchain/TxLookup';
import { BlockchainBlock } from '../../../common/blockchain/block/BlockchainBlock';
import { hashTx } from '../../../common/blockchain/utils/hashTx';

export const makeTxLookupFromBlockArray = (
  blockArr: BlockchainBlock[]
): TxLookup => {
  return _.chain(blockArr)
    .flatMap((b) => b.txs)
    .keyBy(hashTx)
    .value();

  // return _.reduce<BlockchainBlock, TxLookup>(
  //   blockArr,
  //   (acc, block) => ({ ...acc, ..._.keyBy(block.txs, hashTx) }),
  //   {}
  // );
};
