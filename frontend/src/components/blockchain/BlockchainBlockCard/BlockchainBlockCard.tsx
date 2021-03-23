import React from 'react';
import { Card } from 'react-bootstrap';

import './BlockchainBlockCard.scss';
import { BlockchainBlock } from '../../../common/blockchain/block/BlockchainBlock';
import { hashBlock } from '../../../common/blockchain/utils/hashBlock';

interface BlockchainBlockCardProps {
  block: BlockchainBlock;
}

export const BlockchainBlockCard: React.FC<BlockchainBlockCardProps> = (
  props
) => {
  const { block } = props;

  return (
    <div className="comp-blockchain-block-db-pane">
      <Card>
        <Card.Header>
          Details of block <code>{hashBlock(block.header)}</code>
        </Card.Header>
        <Card.Body>
          <div>
            Previous hash: <code>{block.header.previousHash}</code>
          </div>
          <div className="border-top mt-1 pt-1">
            Difficulty target: <code>{block.header.leadingZeroCount}</code>
          </div>
          <div className="border-top mt-1 pt-1">
            Timestamp: <code>{block.header.timestamp}</code> (
            {new Date(block.header.timestamp).toLocaleString()})
          </div>
          <div className="border-top mt-1 pt-1">
            Nonce: <code>{block.header.nonce}</code>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};
