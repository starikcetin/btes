import _ from 'lodash';
import React from 'react';
import { useSelector } from 'react-redux';
import { Col, Container, Nav, Row, Tab } from 'react-bootstrap';

import './NodeBlockchainDashboard.scss';
import { BlockchainOverviewPane } from '../BlockchainOverviewPane/BlockchainOverviewPane';
import { BlockchainBlockDbPane } from '../BlockchainBlockDbPane/BlockchainBlockDbPane';
import { BlockchainMinerPane } from '../BlockchainMinerPane/BlockchainMinerPane';
import { BlockchainTxPoolPane } from '../BlockchainTxPoolPane/BlockchainTxPoolPane';
import { BlockchainWalletPane } from '../BlockchainWalletPane/BlockchainWalletPane';
import { hasValue } from '../../../common/utils/hasValue';
import { RootState } from '../../../state/RootState';

const tabKey = {
  overview: 'overview',
  blockDb: 'block-database',
  txPool: 'transaction-pool',
  wallet: 'wallet',
  miner: 'miner',
} as const;

interface NodeBlockchainDashboardProps {
  simulationUid: string;
  nodeUid: string;
}

export const NodeBlockchainDashboard: React.FC<NodeBlockchainDashboardProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  const minerState = useSelector((state: RootState) => {
    const currentState =
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.miner
        .currentState;

    if (currentState.state === 'stopped') {
      return currentState.stopReason;
    } else {
      return currentState.state;
    }
  });

  if (!hasValue(nodeUid)) {
    return <div>Node not found</div>;
  }

  return (
    <div className="comp-node-blockchain-dashboard">
      <Tab.Container
        id={`comp-node-blockchain-dashboard__tabs__${nodeUid}`}
        defaultActiveKey={tabKey.overview}
        unmountOnExit={true}
        mountOnEnter={true}
      >
        <Container>
          <Row>
            <Col xl="2" className="position-relative">
              <Nav variant="pills" className="flex-xl-column sticky-top">
                <Nav.Item
                  className="text-lg-right"
                  id="comp-node-blockchain-dashboard__overview-tab-handle"
                >
                  <Nav.Link eventKey={tabKey.overview}>Overview</Nav.Link>
                </Nav.Item>
                <Nav.Item
                  className="text-lg-right"
                  id="comp-node-blockchain-dashboard__block-database-tab-handle"
                >
                  <Nav.Link eventKey={tabKey.blockDb}>Block Database</Nav.Link>
                </Nav.Item>
                <Nav.Item
                  className="text-lg-right"
                  id="comp-node-blockchain-dashboard__transaction-pool-tab-handle"
                >
                  <Nav.Link eventKey={tabKey.txPool}>Transaction Pool</Nav.Link>
                </Nav.Item>
                <Nav.Item
                  className="text-lg-right"
                  id="comp-node-blockchain-dashboard__wallet-tab-handle"
                >
                  <Nav.Link eventKey={tabKey.wallet}>Wallet</Nav.Link>
                </Nav.Item>
                <Nav.Item
                  className="text-lg-right"
                  id="comp-node-blockchain-dashboard__miner-tab-handle"
                >
                  <Nav.Link eventKey={tabKey.miner}>
                    Miner <small>({_.capitalize(minerState)})</small>
                  </Nav.Link>
                </Nav.Item>
              </Nav>
            </Col>
            <Col xl="10">
              <Tab.Content className="comp-node-blockchain-dashboard--tab-content-container">
                <Tab.Pane eventKey={tabKey.overview}>
                  <BlockchainOverviewPane
                    simulationUid={simulationUid}
                    nodeUid={nodeUid}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey={tabKey.blockDb}>
                  <BlockchainBlockDbPane
                    simulationUid={simulationUid}
                    nodeUid={nodeUid}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey={tabKey.txPool}>
                  <BlockchainTxPoolPane
                    simulationUid={simulationUid}
                    nodeUid={nodeUid}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey={tabKey.wallet}>
                  <BlockchainWalletPane
                    simulationUid={simulationUid}
                    nodeUid={nodeUid}
                  />
                </Tab.Pane>
                <Tab.Pane eventKey={tabKey.miner}>
                  <BlockchainMinerPane
                    simulationUid={simulationUid}
                    nodeUid={nodeUid}
                  />
                </Tab.Pane>
              </Tab.Content>
            </Col>
          </Row>
        </Container>
      </Tab.Container>
    </div>
  );
};
