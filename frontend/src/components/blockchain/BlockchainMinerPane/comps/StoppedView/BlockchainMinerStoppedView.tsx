import React from 'react';
import { Card, ProgressBar, Table, Button } from 'react-bootstrap';

import './BlockchainMinerStoppedView.scss';
import { BlockchainMinerStoppedState } from '../../../../../common/blockchain/miner/BlockchainMinerStateData';
import { hasValue } from '../../../../../common/utils/hasValue';
import { simulationBridge } from '../../../../../services/simulationBridge';

const numberFormatter = new Intl.NumberFormat();

interface BlockchainMinerStoppedViewProps {
  state: BlockchainMinerStoppedState;
  simulationUid: string;
  nodeUid: string;
}

export const BlockchainMinerStoppedView: React.FC<BlockchainMinerStoppedViewProps> = (
  props
) => {
  const { state, simulationUid, nodeUid } = props;

  const dismiss = () => {
    simulationBridge.sendBlockchainDismissMining(simulationUid, { nodeUid });
  };

  const broadcast = () => {
    simulationBridge.sendBlockchainBroadcastMinedBlock(simulationUid, {
      nodeUid,
    });
  };

  return (
    <div className="comp-blockchain-miner-stopped-view">
      <Card>
        <Card.Header>
          Mining {state.stopReason === 'success' ? 'successful' : 'aborted'}{' '}
          after {numberFormatter.format(state.attemptCount)} attempts.
        </Card.Header>
        <Card.Body>
          <Card.Title>Final attempt</Card.Title>
          {hasValue(state.finalAttempt) && (
            <Table striped size="sm">
              <thead>
                <tr>
                  <th>Nonce</th>
                  <th>Timestamp</th>
                  <th>Hash</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <code>{state.finalAttempt.nonce}</code>
                  </td>
                  <td>
                    <code>{state.finalAttempt.timestamp}</code>
                  </td>
                  <td>
                    <code>{state.finalAttempt.hash}</code>
                  </td>
                </tr>
              </tbody>
            </Table>
          )}
        </Card.Body>
        <Card.Footer className="d-flex justify-content-center">
          <Button variant="danger" onClick={() => dismiss()}>
            {state.stopReason === 'success' ? 'Discard' : 'Dismiss'}
          </Button>
          {state.stopReason === 'success' && (
            <Button
              variant="success"
              onClick={() => broadcast()}
              className="ml-3"
            >
              Broadcast
            </Button>
          )}
        </Card.Footer>
      </Card>
    </div>
  );
};
