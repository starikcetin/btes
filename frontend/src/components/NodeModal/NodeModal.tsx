import React from 'react';
import { useSelector } from 'react-redux';
import { Modal, Tab, Table, Tabs } from 'react-bootstrap';

import './NodeModal.scss';
import { empty } from '../../common/utils/empty';
import { RootState } from '../../state/RootState';
import { NodeData } from '../../state/simulation/data/NodeData';
import LogTable from '../LogTable/LogTable';
import NodeNetworkDashboard from '../NodeNetworkDashboard/NodeNetworkDashboard';
import { NodeMailsDashboard } from '../NodeMailsDashboard/NodeMailsDashboard';
import { NodeBlockchainDashboard } from '../blockchain/NodeBlockchainDashboard/NodeBlockchainDashboard';
import { hasValue } from '../../common/utils/hasValue';

interface NodeModalProps {
  closeHandler: () => void;
  simulationUid: string;
  nodeUid: string | null;
}

const NodeModal: React.FC<NodeModalProps> = (props) => {
  const { closeHandler, simulationUid, nodeUid } = props;
  const node = useSelector((state: RootState) =>
    nodeUid
      ? state.simulation[simulationUid].nodeMap[nodeUid]
      : empty<NodeData>()
  );

  return (
    <Modal
      show={!!nodeUid}
      onHide={closeHandler}
      backdrop="static"
      keyboard={false}
      size="xl"
      scrollable
      dialogClassName="comp-node-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Node Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!hasValue(nodeUid) ? (
          <div>(Node not found)</div>
        ) : (
          <Tabs
            defaultActiveKey="summary"
            id={`comp-node-modal__tabs__${node.nodeUid}`}
            unmountOnExit={true}
            mountOnEnter={true}
          >
            <Tab
              eventKey="summary"
              title="Summary"
              className="comp-node-modal--tab-content"
            >
              <Table striped>
                <colgroup>
                  <col style={{ width: '50%' }} />
                  <col style={{ width: '50%' }} />
                </colgroup>
                <tbody>
                  <tr>
                    <td>ID:</td>
                    <td>{node.nodeUid}</td>
                  </tr>
                  {node.nodeName !== '' ? (
                    <tr>
                      <td>Name:</td>
                      <td>{node.nodeName}</td>
                    </tr>
                  ) : (
                    <></>
                  )}
                  <tr>
                    <td>Status:</td>
                    <td>Active</td>
                  </tr>
                  <tr>
                    <td>Wallet:</td>
                    <td>Yes</td>
                  </tr>
                  <tr>
                    <td>Funds:</td>
                    <td>2345</td>
                  </tr>
                  <tr>
                    <td>Current Activity:</td>
                    <td>Idle</td>
                  </tr>
                </tbody>
              </Table>
            </Tab>
            <Tab
              eventKey="network"
              title="Network"
              className="comp-node-modal--tab-content"
              tabClassName="comp-node-modal--network-tab-handle"
            >
              <NodeNetworkDashboard
                simulationUid={simulationUid}
                nodeUid={nodeUid}
              />
            </Tab>
            <Tab
              eventKey="mails"
              title="Mails"
              className="comp-node-modal--tab-content"
            >
              <NodeMailsDashboard
                simulationUid={simulationUid}
                nodeUid={nodeUid}
              />
            </Tab>
            <Tab
              eventKey="blockchain"
              title="Blockchain"
              className="comp-node-modal--tab-content"
            >
              <NodeBlockchainDashboard
                simulationUid={simulationUid}
                nodeUid={nodeUid}
              />
            </Tab>
            <Tab
              eventKey="log"
              title="Log"
              className="comp-node-modal--tab-content"
            >
              <LogTable logs={node.logs} />
            </Tab>
          </Tabs>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default NodeModal;
