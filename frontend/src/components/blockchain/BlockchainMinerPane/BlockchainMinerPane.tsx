import React from 'react';

import './BlockchainMinerPane.scss';

interface BlockchainMinerPaneProps {
  simulationUid: string;
  nodeUid: string;
}

export const BlockchainMinerPane: React.FC<BlockchainMinerPaneProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  return (
    <div className="comp-blockchain-miner-pane">
      Miner Pane {simulationUid} {nodeUid}
    </div>
  );
};
