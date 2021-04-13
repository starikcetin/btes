import React from 'react';
import { Card } from 'react-bootstrap';

import './BlockchainBlockCard.scss';
import { BlockchainBlock } from '../../../common/blockchain/block/BlockchainBlock';
import { hashBlock } from '../../../common/blockchain/utils/hashBlock';
import { BlockchainTxCard } from '../BlockchainTxCard/BlockchainTxCard';
import { useKeyGenerator } from '../../../hooks/useKeyGenerator';

interface BlockchainBlockCardProps {
  simulationUid: string;
  nodeUid: string;
  block: BlockchainBlock;
}

export const BlockchainBlockCard: React.FC<BlockchainBlockCardProps> = (
  props
) => {
  const { simulationUid, nodeUid, block } = props;
  const keyGen = useKeyGenerator();

  return (
    <div className="comp-blockchain-block-card">
      <Card>
        <Card.Header>
          Details of block <code>{hashBlock(block.header)}</code>
        </Card.Header>
        <Card.Body>
          <Card.Title>Header</Card.Title>
          <div className="mb-1">
            Previous hash: <code>{block.header.previousHash}</code>
          </div>
          <div className="mb-1">
            Difficulty target: <code>{block.header.leadingZeroCount}</code>
          </div>
          <div className="mb-1">
            Timestamp: <code>{block.header.timestamp}</code> (
            {new Date(block.header.timestamp).toLocaleString()})
          </div>
          <div>
            Nonce: <code>{block.header.nonce}</code>
          </div>
          <hr />
          <Card.Title>Transactions ({block.txs.length})</Card.Title>
          <div>
            {block.txs.map((tx, i) => (
              <div className="mt-3 global-first-mt-0" key={keyGen(tx, i)}>
                <BlockchainTxCard
                  simulationUid={simulationUid}
                  nodeUid={nodeUid}
                  tx={tx}
                />
              </div>
            ))}
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
