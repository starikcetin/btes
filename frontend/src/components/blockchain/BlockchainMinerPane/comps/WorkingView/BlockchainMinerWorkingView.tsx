import React from 'react';
import { Button, Card, ProgressBar, Table } from 'react-bootstrap';

import './BlockchainMinerWorkingView.scss';
import { BlockchainMinerWorkingState } from '../../../../../common/blockchain/miner/BlockchainMinerStateData';
import { simulationBridge } from '../../../../../services/simulationBridge';

const numberFormatter = new Intl.NumberFormat();

interface BlockchainMinerWorkingViewProps {
  state: BlockchainMinerWorkingState;
  simulationUid: string;
  nodeUid: string;
}

export const BlockchainMinerWorkingView: React.FC<BlockchainMinerWorkingViewProps> = (
  props
) => {
  const { state, simulationUid, nodeUid } = props;

  const abort = () => {
    simulationBridge.sendBlockchainAbortMining(simulationUid, { nodeUid });
  };

  return (
    <div className="comp-blockchain-miner-working-view">
      <Card>
        <Card.Header>
          <ProgressBar animated now={100} variant="info" />
        </Card.Header>
        <Card.Body>
          <Card.Text>
            Aiming for {state.task.blockTemplate.difficultyTarget} leading
            zeros. {numberFormatter.format(state.attemptCount)} attempts so far.
          </Card.Text>
          <Table striped size="sm">
            <thead>
              <tr>
                <th>Nonce</th>
                <th>Timestamp</th>
                <th>Hash</th>
              </tr>
            </thead>
            <tbody>
              {state.recentAttempts.map((a) => (
                <tr>
                  <td>
                    <code>{a.nonce}</code>
                  </td>
                  <td>
                    <code>{a.timestamp}</code>
                  </td>
                  <td>
                    <code>{a.hash}</code>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </Card.Body>
        <Card.Footer>
          <Button variant="danger" onClick={() => abort()}>
            Abort
          </Button>
        </Card.Footer>
      </Card>
    </div>
  );
};
