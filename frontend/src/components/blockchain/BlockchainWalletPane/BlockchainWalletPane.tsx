import React from 'react';

import './BlockchainWalletPane.scss';

interface BlockchainWalletPaneProps {
  simulationUid: string;
  nodeUid: string;
}

export const BlockchainWalletPane: React.FC<BlockchainWalletPaneProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  return (
    <div className="comp-blockchain-wallet-pane">
      Wallet Pane {simulationUid} {nodeUid}
    </div>
  );
};
