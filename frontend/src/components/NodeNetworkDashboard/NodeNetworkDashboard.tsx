import _ from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';

import { RootState } from '../../state/RootState';
import { simulationBridge } from '../../services/simulationBridge';
import { itemwiseEqual } from '../../utils/itemwiseEqual';
import { SaneSelect } from '../SaneSelect/SaneSelect';
import { hasValue } from '../../common/utils/hasValue';

type TargetNodeSelectOptionType = { value: string; label: string };

interface NodeNetworkDashboardProps {
  simulationUid: string;
  nodeUid: string | null;
}

const NodeNetworkDashboard: React.FC<NodeNetworkDashboardProps> = (props) => {
  const { simulationUid, nodeUid } = props;

  const [
    targetNodeSelectValue,
    setTargetNodeSelectValue,
  ] = useState<TargetNodeSelectOptionType | null>(null);

  const connectionMap = useSelector((state: RootState) => {
    return nodeUid
      ? state.simulation[simulationUid].connectionMap.connectionMap[nodeUid]
      : {};
  });

  const allNodeUids = useSelector((state: RootState) => {
    return Object.keys(state.simulation[simulationUid].nodeMap);
  }, itemwiseEqual);

  const connectedNodeUids = _.chain(connectionMap)
    .pickBy(hasValue)
    .keys()
    .value();

  const unconnectedNodeUids = _.without(
    allNodeUids,
    ...connectedNodeUids,
    nodeUid || ''
  );

  const disconnect = (otherNodeUid: string) => {
    if (null === nodeUid) {
      throw new Error(`disconnect called, but nodeUid is null`);
    }

    simulationBridge.sendSimulationDisconnectNodes(simulationUid, {
      firstNodeUid: nodeUid,
      secondNodeUid: otherNodeUid,
    });
  };

  const connect = () => {
    if (null === nodeUid) {
      throw new Error(`connect called, but nodeUid is ${nodeUid}`);
    }

    if (null === targetNodeSelectValue) {
      throw new Error(
        `connect called, but selectedOtherNodeOption is ${targetNodeSelectValue}`
      );
    }

    simulationBridge.sendSimulationConnectNodes(simulationUid, {
      firstNodeUid: nodeUid,
      secondNodeUid: targetNodeSelectValue.value,
    });
  };

  const makeTargetNodeSelectOptions = (targetNodeUids: string[]) =>
    targetNodeUids.map((targetNodeUid) => ({
      value: targetNodeUid,
      label: targetNodeUid,
    }));

  return (
    <Container>
      <Row>
        <Col id="comp-node-network-dashboard__display-column">
          <Row>
            <Col>Connected Nodes</Col>
          </Row>
          <Row>
            <Col>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th className="w-25">Node UID</th>
                    <th className="w-25">Latency (ms)</th>
                    <th className="w-50">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {connectedNodeUids.length === 0 ? (
                    <tr>
                      <td colSpan={3}>No connections yet.</td>
                    </tr>
                  ) : (
                    connectedNodeUids.map((nodeUid) => (
                      <tr key={nodeUid}>
                        <td>{nodeUid}</td>
                        <td>{connectionMap[nodeUid].latencyInMs}</td>
                        <td>
                          <Button
                            variant="danger"
                            size="sm"
                            type="button"
                            onClick={() => disconnect(nodeUid)}
                          >
                            Disconnect
                          </Button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </Table>
            </Col>
          </Row>
        </Col>
        <Col id="comp-node-network-dashboard__action-column">
          <Form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Form.Group id="comp-node-network-dashboard__target-node-input">
              <Form.Label>Target Node</Form.Label>
              <SaneSelect
                options={makeTargetNodeSelectOptions(unconnectedNodeUids)}
                onChange={(val) => setTargetNodeSelectValue(val)}
              />
            </Form.Group>
            <Button
              id="comp-node-network-dashboard__connect-button"
              variant="success"
              type="button"
              onClick={connect}
              disabled={null === targetNodeSelectValue}
            >
              Connect
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default NodeNetworkDashboard;
