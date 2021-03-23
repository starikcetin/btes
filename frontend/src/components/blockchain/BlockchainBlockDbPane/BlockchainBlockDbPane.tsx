import React, { useState } from 'react';
import { Card } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import './BlockchainBlockDbPane.scss';
import { BlockchainTreeView } from '../BlockchainTreeView/BlockchainTreeView';
import { BlockchainBlockCard } from '../BlockchainBlockCard/BlockchainBlockCard';
import { hasValue } from '../../../common/utils/hasValue';
import { RootState } from '../../../state/RootState';

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

  const selectedBlockchainBlock = useSelector((state: RootState) => {
    if (!hasValue(selectedBlockchainBlockHash)) {
      return null;
    } else {
      const selectedBlock =
        state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.blockDb
          .blockchainLookup[selectedBlockchainBlockHash];

      if (!hasValue(selectedBlock)) {
        throw new Error(
          'A block selected from the blockchain does not have a lookup entry!'
        );
      }

      return selectedBlock;
    }
  });

  const orphanBlocks = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.blockDb
        .orphanage
  );

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
          <div className="mt-3">
            {hasValue(selectedBlockchainBlock) ? (
              <BlockchainBlockCard block={selectedBlockchainBlock} />
            ) : (
              <Card.Text className="text-muted">
                Click on a block in the tree above to see its details.
              </Card.Text>
            )}
          </div>
        </Card.Body>
      </Card>
      <Card className="mt-3">
        <Card.Header>Orphan Blocks ({orphanBlocks.length})</Card.Header>
        <Card.Body>
          {orphanBlocks.length === 0 ? (
            <Card.Text className="text-muted">No orphan blocks.</Card.Text>
          ) : (
            orphanBlocks.map((orphan) => (
              <div className="comp-blockchain-block-db-pane--orphan-block-card">
                <BlockchainBlockCard block={orphan} />
              </div>
            ))
          )}
        </Card.Body>
      </Card>
    </div>
  );
};
