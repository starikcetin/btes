import React, { useState } from 'react';
import { Card } from 'react-bootstrap';

import './BlockchainBlockDbPane.scss';
import { BlockchainTreeView } from '../BlockchainTreeView/BlockchainTreeView';

interface BlockchainBlockDbPaneProps {
  simulationUid: string;
  nodeUid: string;
}

export const BlockchainBlockDbPane: React.FC<BlockchainBlockDbPaneProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  const [
    selectedBlockchainBlockHash,
    setSelectedBlockchainBlockHash,
  ] = useState<string | null>(null);

  return (
    <div className="comp-blockchain-block-db-pane">
      <Card>
        <Card.Header>Blockchain</Card.Header>
        <Card.Body>
          <BlockchainTreeView
            simulationUid={simulationUid}
            nodeUid={nodeUid}
            onBlockClick={setSelectedBlockchainBlockHash}
          />
          Selected hash: {selectedBlockchainBlockHash}
        </Card.Body>
      </Card>
      <Card className="mt-3">
        <Card.Header>Orphan Blocks</Card.Header>
        <Card.Body>TODO</Card.Body>
      </Card>
    </div>
  );
};
