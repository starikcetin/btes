import React from 'react';

import './BlockchainTxPoolPane.scss';

interface BlockchainTxPoolPaneProps {
  simulationUid: string;
  nodeUid: string;
}

export const BlockchainTxPoolPane: React.FC<BlockchainTxPoolPaneProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  return (
    <div className="comp-blockchain-tx-pool-pane">
      Tx Pool Pane {simulationUid} {nodeUid}
    </div>
  );
};
