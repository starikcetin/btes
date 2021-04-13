import _ from 'lodash';

import { BlockchainBlock } from '../../../common/blockchain/block/BlockchainBlock';
import { TreeNodeJsonObject } from '../../../common/tree/TreeNodeJsonObject';
import { BlockLookup } from '../data/blockchain/BlockLookup';

export const makeBlockLookup = (
  rootNode: TreeNodeJsonObject<BlockchainBlock>
): BlockLookup => ({
  [rootNode.id]: rootNode.data,
  ..._.reduce(
    rootNode.children,
    (acc, it) => ({ ...acc, ...makeBlockLookup(it) }),
    {}
  ),
});
