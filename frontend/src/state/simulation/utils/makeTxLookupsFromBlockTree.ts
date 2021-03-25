import _ from 'lodash';
import { hasValue } from '../../../common/utils/hasValue';
import { TxLookup } from '../data/blockchain/TxLookup';
import { BlockchainBlock } from '../../../common/blockchain/block/BlockchainBlock';
import { Tree } from '../../../common/tree/Tree';
import { makeTxLookupFromBlockArray } from './makeTxLookupFromBlockArray';

export const makeTxLookupsFromBlockTree = (
  blockTree: Tree<BlockchainBlock>
): { mainBranchTxLookup: TxLookup; sideBranchesTxLookup: TxLookup } => {
  const mainBranch = [...blockTree.getMainBranchDataIterator()];

  if (hasValue(blockTree.root)) {
    mainBranch.push(blockTree.root.data);
  }

  const mainBranchTxLookup = makeTxLookupFromBlockArray(mainBranch);

  const sideBranchBlocks = _.chain(blockTree.heads)
    .filter((h) => h.id !== blockTree.mainBranchHead?.id)
    .flatMap((n) => [
      ...blockTree.getNodeIteratorUntilMainBranchForkPointOrRoot(n),
    ])
    .uniqBy((n) => n.id)
    .map((n) => n.data)
    .value();

  const sideBranchesTxLookup = makeTxLookupFromBlockArray(sideBranchBlocks);

  return { mainBranchTxLookup, sideBranchesTxLookup };
};
