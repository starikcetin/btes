import _ from 'lodash';

import { BlockchainBlock } from '../../../../../common/src/blockchain/block/BlockchainBlock';
import { TreeNodeJsonObject } from '../../../common/tree/TreeNodeJsonObject';

export const makeBlockLookup = (
  rootNode: TreeNodeJsonObject<BlockchainBlock>
): Record<string, BlockchainBlock> => ({
  [rootNode.id]: rootNode.data,
  ..._.reduce(
    rootNode.children,
    (acc, it) => ({ ...acc, ...makeBlockLookup(it) }),
    {}
  ),
});
