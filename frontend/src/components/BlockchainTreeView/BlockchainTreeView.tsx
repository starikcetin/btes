import React from 'react';
import Tree from 'react-d3-tree';
import { useSelector } from 'react-redux';
import { RawNodeDatum } from 'react-d3-tree/lib/types/common';

import './BlockchainTreeView.scss';
import { RootState } from '../../state/RootState';
import { SimulationNodeBlockchainBlockSnapshot } from '../../common/SimulationNodeBlockchainBlockSnapshot';

interface BlockchainTreeViewProps {
  simulationUid: string;
  nodeUid: string | null;
}

function format(
  rootBlock: SimulationNodeBlockchainBlockSnapshot,
  isRoot = true
): RawNodeDatum {
  return {
    name: rootBlock.name,
    children: rootBlock.children?.map((child) => format(child, false)),
  };
}

export const BlockchainTreeView: React.FC<BlockchainTreeViewProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  const rootBlock = useSelector((state: RootState) => {
    return nodeUid
      ? state.simulation[simulationUid].nodeMap[nodeUid].blockchainBlock
      : [];
  });

  return (
    <div className="d-flex justify-content-center align-items-center border comp-blockchain-tree-view">
      <Tree data={format(rootBlock as SimulationNodeBlockchainBlockSnapshot)} />
    </div>
  );
};
