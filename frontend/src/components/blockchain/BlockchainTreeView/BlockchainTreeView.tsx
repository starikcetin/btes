import _ from 'lodash';
import React from 'react';
import Tree from 'react-d3-tree';
import { useSelector } from 'react-redux';
import { RawNodeDatum } from 'react-d3-tree/lib/types/common';
import { TreeNodeEventCallback } from 'react-d3-tree/lib/Tree/types';

import './BlockchainTreeView.scss';
import { RootState } from '../../../state/RootState';
import { BlockchainBlock } from '../../../common/blockchain/block/BlockchainBlock';
import { TreeNodeJsonObject } from '../../../common/tree/TreeNodeJsonObject';
import { hasValue } from '../../../common/utils/hasValue';

interface BlockchainTreeViewProps {
  simulationUid: string;
  nodeUid: string;
  onBlockClick?: (blockHash: string) => void;
}

const hashToName = (hash: string, leadingZeroTarget: number): string => {
  const leadingZeroes = _.takeWhile(hash, (c) => c === '0').join('');
  const missingZeros = 0; // Math.max(0, leadingZeroTarget - leadingZeroes.length);
  const truncatedRest = _.trimStart(hash, '0').substr(0, 6 + missingZeros);
  return leadingZeroes.length + '..' + truncatedRest;
};

const format = (
  rootBlock: TreeNodeJsonObject<BlockchainBlock>,
  leadingZeroTarget: number
): RawNodeDatum => {
  return {
    name: hashToName(rootBlock.id, leadingZeroTarget),
    children:
      rootBlock.children && rootBlock.children.length > 0
        ? rootBlock.children.map((c) => format(c, leadingZeroTarget))
        : undefined,
  };
};

const makeNameToHashMap = (
  rootNode: TreeNodeJsonObject<BlockchainBlock>,
  leadingZeroTarget: number
): Record<string, string> => {
  return {
    [hashToName(rootNode.id, leadingZeroTarget)]: rootNode.id,
    ..._.reduce(
      rootNode.children,
      (acc, it) => ({ ...acc, ...makeNameToHashMap(it, leadingZeroTarget) }),
      {}
    ),
  };
};

export const BlockchainTreeView: React.FC<BlockchainTreeViewProps> = (
  props
) => {
  const { simulationUid, nodeUid, onBlockClick } = props;

  const rootBlock = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.blockDb
        .blockchain.root
  );

  const leadingZeroTarget = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.config
        .targetLeadingZeroCount
  );

  const nameToHashMap = hasValue(rootBlock)
    ? makeNameToHashMap(rootBlock, leadingZeroTarget)
    : {};

  const handleOnNodeClick: TreeNodeEventCallback = (node) => {
    if (!hasValue(onBlockClick)) {
      return;
    }

    onBlockClick(nameToHashMap[node.name]);
  };

  return (
    <div className="d-flex justify-content-center align-items-center border comp-blockchain-tree-view">
      {!hasValue(rootBlock) ? (
        <div>(No blocks found)</div>
      ) : (
        <Tree
          nodeSize={{
            x: 100 + leadingZeroTarget * 10,
            y: 75,
          }}
          collapsible={false}
          translate={{ x: 50, y: 200 }}
          data={format(rootBlock, leadingZeroTarget)}
          rootNodeClassName="blockchain-tree--root-node"
          branchNodeClassName="blockchain-tree--branch-node"
          leafNodeClassName="blockchain-tree--leaf-node"
          onNodeClick={handleOnNodeClick}
        />
      )}
    </div>
  );
};
