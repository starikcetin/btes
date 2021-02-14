// show the current connections
// disconnect a connected node
// connect to a node

// TODO: latency:
// * show latency
// * adjust own latency
// * show latencies of connected nodes
// * calculate total latencies to connected nodes

import _ from 'lodash';
import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import Select from 'react-select';

import { RootState } from '../../state/RootState';
import { simulationBridge } from '../../services/simulationBridge';
import { itemwiseEqual } from '../../utils/itemwiseEqual';

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

  const [targetNodeSelectOptions, setTargetNodeSelectOptions] = useState<
    TargetNodeSelectOptionType[]
  >([]);

  const connectedNodeUids = useSelector((state: RootState) =>
    nodeUid
      ? state.simulation[simulationUid].nodeMap[nodeUid].connectedNodeUids
      : []
  );

  const unconnectedNodeUids = useSelector((state: RootState) => {
    const allNodeUids = Object.keys(state.simulation[simulationUid].nodeMap);

    const connectedNodeUids = nodeUid
      ? state.simulation[simulationUid].nodeMap[nodeUid].connectedNodeUids
      : [];

    return _.without(allNodeUids, ...connectedNodeUids, nodeUid || '');
  }, itemwiseEqual);

  useEffect(() => {
    const isUnconnectedSelectOptionsOutdated = !itemwiseEqual(
      targetNodeSelectOptions.map((o) => o.value),
      unconnectedNodeUids
    );

    if (isUnconnectedSelectOptionsOutdated) {
      const options = makeOtherNodeUidSelectOptions(unconnectedNodeUids);
      setTargetNodeSelectOptions(options);
    }
  }, [targetNodeSelectOptions, unconnectedNodeUids]);

  useEffect(() => {
    const isUnconnectedSelectValueInvalid =
      targetNodeSelectValue &&
      !targetNodeSelectOptions.some(
        (opt) => opt.value === targetNodeSelectValue.value
      );

    if (isUnconnectedSelectValueInvalid) {
      setTargetNodeSelectValue(null);
    }
  }, [targetNodeSelectOptions, targetNodeSelectValue]);

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

  const makeOtherNodeUidSelectOptions = (otherNodeUids: string[]) => {
    return otherNodeUids.map((otherNodeUid) => {
      return {
        value: otherNodeUid,
        label: otherNodeUid,
      };
    });
  };

  return (
    <Container>
      <Row>
        <Col>
          <Row>
            <Col>Connected Nodes</Col>
          </Row>
          <Row>
            <Col>
              <Table striped bordered hover>
                <thead>
                  <tr>
                    <th className="w-50">Node UID</th>
                    <th className="w-50">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {connectedNodeUids.length === 0 ? (
                    <tr>
                      <td colSpan={2}>No connections yet.</td>
                    </tr>
                  ) : (
                    connectedNodeUids.map((nodeUid) => (
                      <tr key={nodeUid}>
                        <td>{nodeUid}</td>
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
        <Col>
          <Form
            onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
              e.preventDefault();
              e.stopPropagation();
            }}
          >
            <Form.Group controlId="exampleForm.ControlSelect1">
              <Form.Label>Other Node</Form.Label>
              <Select
                options={targetNodeSelectOptions}
                value={targetNodeSelectValue}
                onChange={(val, act) => setTargetNodeSelectValue(val)}
              />
            </Form.Group>
            <Button
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
