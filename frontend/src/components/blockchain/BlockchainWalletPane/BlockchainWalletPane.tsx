import React, { useState } from 'react';
import { Button } from 'react-bootstrap';

import './BlockchainWalletPane.scss';
import { BlockchainKeyPairCard } from '../BlockchainKeyPairCard/BlockchainKeyPairCard';
import BlockchainCreateTxModal from '../BlockchainCreateTxModal/BlockchainCreateTxModal';

interface BlockchainWalletPaneProps {
  simulationUid: string;
  nodeUid: string;
}

export const BlockchainWalletPane: React.FC<BlockchainWalletPaneProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  const [isCreateTxModalOpen, setIsCreateTxModalOpen] = useState(false);

  return (
    <div className="comp-blockchain-wallet-pane">
      <BlockchainKeyPairCard simulationUid={simulationUid} nodeUid={nodeUid} />
      <div className="mt-3 d-flex justify-content-center">
        <Button variant="primary" onClick={() => setIsCreateTxModalOpen(true)}>
          Create Transaction
        </Button>
      </div>
      <BlockchainCreateTxModal
        {...props}
        show={isCreateTxModalOpen}
        closeHandler={() => setIsCreateTxModalOpen(false)}
      />
    </div>
  );
};
