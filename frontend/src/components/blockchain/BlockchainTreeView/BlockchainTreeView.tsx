import React from 'react';
import Tree from 'react-d3-tree';
import { useSelector } from 'react-redux';
import { RawNodeDatum } from 'react-d3-tree/lib/types/common';

import './BlockchainTreeView.scss';
import { RootState } from '../../../state/RootState';
import { BlockchainBlock } from '../../../common/blockchain/block/BlockchainBlock';
import { TreeNodeJsonObject } from '../../../common/tree/TreeNodeJsonObject';
import { hasValue } from '../../../common/utils/hasValue';

interface BlockchainTreeViewProps {
  simulationUid: string;
  nodeUid: string;
}

function format(rootBlock: TreeNodeJsonObject<BlockchainBlock>): RawNodeDatum {
  return {
    name: rootBlock.id,
    children: rootBlock.children?.map((child) => format(child)),
  };
}

export const BlockchainTreeView: React.FC<BlockchainTreeViewProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  const rootBlock = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.blockDb
        .blockchain.root
  );

  return (
    <div className="d-flex justify-content-center align-items-center border comp-blockchain-tree-view">
      {!hasValue(rootBlock) ? (
        <div>(No blocks found)</div>
      ) : (
        <Tree data={format(rootBlock)} />
      )}
    </div>
  );
};
