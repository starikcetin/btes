import React from 'react';

import './BlockchainWalletPane.scss';
import { BlockchainKeyPairCard } from '../BlockchainKeyPairCard/BlockchainKeyPairCard';
import { Button } from 'react-bootstrap';

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
      <BlockchainKeyPairCard simulationUid={simulationUid} nodeUid={nodeUid} />
      <div className="mt-3 d-flex justify-content-center">
        <Button variant="primary">Create Transaction</Button>
      </div>
    </div>
  );
};
