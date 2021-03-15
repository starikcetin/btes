import React from 'react';
import { BlockchainTreeView } from '../BlockchainTreeView/BlockchainTreeView';

import './BlockchainBlockDbPane.scss';

interface BlockchainBlockDbPaneProps {
  simulationUid: string;
  nodeUid: string;
}

export const BlockchainBlockDbPane: React.FC<BlockchainBlockDbPaneProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  return (
    <div className="comp-blockchain-block-db-pane">
      <BlockchainTreeView simulationUid={simulationUid} nodeUid={nodeUid} />
    </div>
  );
};
