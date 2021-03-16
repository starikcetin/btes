import React from 'react';
import { useSelector } from 'react-redux';

import './BlockchainWalletPane.scss';
import { RootState } from '../../../state/RootState';
import { Card, Col, Container, Row } from 'react-bootstrap';
import { BlockchainKeyPairCard } from '../BlockchainKeyPairCard/BlockchainKeyPairCard';

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

  const { keyPair } = walletData;

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
