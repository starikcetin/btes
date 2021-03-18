import React from 'react';

import './BlockchainWalletPane.scss';
import { Col, Container, Row } from 'react-bootstrap';
import { BlockchainKeyPairCard } from '../BlockchainKeyPairCard/BlockchainKeyPairCard';

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
      <Container>
        <Row>
          <Col>
            <BlockchainKeyPairCard
              simulationUid={simulationUid}
              nodeUid={nodeUid}
            />
          </Col>
        </Row>
      </Container>
    </div>
  );
};
