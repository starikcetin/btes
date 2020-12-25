import React from 'react';
import { Col, Container, Modal, Row, Tab, Table, Tabs } from 'react-bootstrap';
import './NodeModal.css';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/RootState';

interface NodeModalProps {
  show: boolean;
  closeHandler: () => void;
  simulationUid: string;
  nodeUid: string;
}

const NodeModal: React.FC<NodeModalProps> = (props) => {
  const { show, closeHandler, simulationUid, nodeUid } = props;
  const node = useSelector(
    (state: RootState) => state.simulation[simulationUid].nodeMap[nodeUid] || {}
  );

  return (
    <Modal
      show={show}
      onHide={closeHandler}
      backdrop="static"
      keyboard={false}
      size="xl"
    >
      <Modal.Header closeButton>
        <Modal.Title>Node Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Tabs defaultActiveKey="summary" id={node.nodeUid}>
          <Tab
            eventKey="summary"
            title="Summary"
            className="node-details-tab-content"
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
            eventKey="blockchain"
            title="Blockchain"
            className="node-details-tab-content"
          >
            <Container>
              <Row>
                <Col>
                  <p>Node Tree</p>
                  {/*<BlockchainTreeView rootBlock={node.blockchainRootBlock} />*/}
                </Col>
              </Row>
            </Container>
          </Tab>
          <Tab eventKey="log" title="Log" className="node-details-tab-content">
            <Table striped>
              <colgroup>
                <col style={{ width: '34%' }} />
                <col style={{ width: '66%' }} />
              </colgroup>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Event</th>
                </tr>
              </thead>
              <tbody>
                <p>logs</p>
              </tbody>
            </Table>
          </Tab>
        </Tabs>
      </Modal.Body>
    </Modal>
  );
};

export default NodeModal;
