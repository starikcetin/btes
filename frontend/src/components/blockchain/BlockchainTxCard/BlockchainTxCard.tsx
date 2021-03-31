import React from 'react';
import { Card } from 'react-bootstrap';

import './BlockchainTxCard.scss';
import { BlockchainTx } from '../../../../../backend/src/common/blockchain/tx/BlockchainTx';
import { hashTx } from '../../../common/blockchain/utils/hashTx';

interface BlockchainTxCardProps {
  tx: BlockchainTx;
}

export const BlockchainTxCard: React.FC<BlockchainTxCardProps> = (props) => {
  const { tx } = props;
  const txHash = hashTx(tx);

  return (
    <div className="comp-blockchain-tx-card">
      <Card>
        <Card.Header>
          Transaction <code>{txHash}</code>
        </Card.Header>
        <Card.Body>tx details here</Card.Body>
      </Card>
    </div>
  );
};
