import React from 'react';
import { useSelector } from 'react-redux';
import { Col, Container, Row } from 'react-bootstrap';

import { empty } from '../../common/utils/empty';
import { RootState } from '../../state/RootState';
import { NodeData } from '../../state/simulation/NodeData';

interface NodeNetworkDashboardProps {
  simulationUid: string;
  nodeUid: string | null;
}

const NodeNetworkDashboard: React.FC<NodeNetworkDashboardProps> = (props) => {
  const { simulationUid, nodeUid } = props;
  const node = useSelector((state: RootState) =>
    nodeUid
      ? state.simulation[simulationUid].nodeMap[nodeUid]
      : empty<NodeData>()
  );

  // show the current connections
  // disconnect a connected node
  // connect to a node

  // TODO: latency:
  // * show latency
  // * adjust own latency
  // * show latencies of connected nodes
  // * calculate total latencies to connected nodes

  return (
    <Container>
      <Row>
        <Col>
          <p>Network</p>
        </Col>
      </Row>
    </Container>
  );
};

export default NodeNetworkDashboard;
