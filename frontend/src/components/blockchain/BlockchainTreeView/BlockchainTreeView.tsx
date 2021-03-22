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

function format(rootBlock: TreeNodeJsonObject<BlockchainBlock>): RawNodeDatum {
  return {
    name: rootBlock.id,
    children:
      rootBlock.children && rootBlock.children.length > 0
        ? rootBlock.children.map(format)
        : undefined,
  };
}

export const BlockchainTreeView: React.FC<BlockchainTreeViewProps> = (
  props
) => {
  const { simulationUid, nodeUid, onBlockClick } = props;

  const rootBlock = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.blockDb
        .blockchain.root
  );

  const handleOnNodeClick: TreeNodeEventCallback = (node) => {
    if (!hasValue(onBlockClick)) {
      return;
    }

    onBlockClick(node.name);
  };

  return (
    <div className="d-flex justify-content-center align-items-center border comp-blockchain-tree-view">
      {!hasValue(rootBlock) ? (
        <div>(No blocks found)</div>
      ) : (
        <Tree
          data={format(rootBlock)}
          rootNodeClassName="blockchain-tree--root-node"
          branchNodeClassName="blockchain-tree--branch-node"
          leafNodeClassName="blockchain-tree--leaf-node"
          onNodeClick={handleOnNodeClick}
        />
      )}
    </div>
  );
};
