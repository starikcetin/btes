import React from 'react';
import { Col, Container, Nav, Row, Tab, Table, Tabs } from 'react-bootstrap';
import { hasValue } from '../../../common/utils/hasValue';
import { BlockchainTreeView } from '../BlockchainTreeView/BlockchainTreeView';

import './NodeBlockchainDashboard.scss';

const tabKey = {
  overview: 'overview',
  blockDb: 'block-database',
  txPool: 'transaction-pool',
  wallet: 'wallet',
  miner: 'miner',
} as const;

interface NodeBlockchainDashboardProps {
  simulationUid: string;
  nodeUid: string | null;
}

export const NodeBlockchainDashboard: React.FC<NodeBlockchainDashboardProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  if (!hasValue(nodeUid)) {
    return <div>Node not found</div>;
  }

  return (
    <div className="comp-node-blockchain-dashboard">
      <Tab.Container
        id={`${nodeUid}__blockchain`}
        defaultActiveKey={tabKey.overview}
      >
        <Container>
          <Row>
            <Col sm="auto">
              <Nav variant="pills" className="flex-sm-column">
                <Nav.Item className="text-sm-right">
                  <Nav.Link eventKey={tabKey.overview}>Overview</Nav.Link>
                </Nav.Item>
                <Nav.Item className="text-sm-right">
                  <Nav.Link eventKey={tabKey.blockDb}>Block Database</Nav.Link>
                </Nav.Item>
                <Nav.Item className="text-sm-right">
                  <Nav.Link eventKey={tabKey.txPool}>Transaction Pool</Nav.Link>
                </Nav.Item>
                <Nav.Item className="text-sm-right">
                  <Nav.Link eventKey={tabKey.wallet}>Wallet</Nav.Link>
                </Nav.Item>
                <Nav.Item className="text-sm-right">
                  <Nav.Link eventKey={tabKey.miner}>Miner</Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col>
              <Tab.Content className="comp-node-blockchain-dashboard--tab-content-container">
                <Tab.Pane eventKey={tabKey.overview}>Overview</Tab.Pane>
                <Tab.Pane eventKey={tabKey.blockDb}>
                  <BlockchainTreeView
                    simulationUid={simulationUid}
                    nodeUid={nodeUid}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey={tabKey.txPool}>Transaction Pool</Tab.Pane>
                <Tab.Pane eventKey={tabKey.wallet}>Wallet</Tab.Pane>
                <Tab.Pane eventKey={tabKey.miner}>Miner</Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Container>
      </Tab.Container>
    </div>
  );
};
