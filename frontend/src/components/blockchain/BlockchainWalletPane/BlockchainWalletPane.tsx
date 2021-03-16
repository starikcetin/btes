import React from 'react';
import { useSelector } from 'react-redux';

import './BlockchainWalletPane.scss';
import { RootState } from '../../../state/RootState';

interface BlockchainWalletPaneProps {
  simulationUid: string;
  nodeUid: string;
}

export const BlockchainWalletPane: React.FC<BlockchainWalletPaneProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  const walletData = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.wallet
  );

  return (
    <div className="comp-blockchain-wallet-pane">
      Wallet Pane {simulationUid} {nodeUid}
    </div>
  );
};
