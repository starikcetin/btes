import React from 'react';

import './BlockchainOverviewPane.scss';

interface BlockchainOverviewPaneProps {
  simulationUid: string;
  nodeUid: string;
}

export const BlockchainOverviewPane: React.FC<BlockchainOverviewPaneProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  return (
    <div className="comp-blockchain-overview-pane">
      Overview Pane {simulationUid} {nodeUid}
    </div>
  );
};
