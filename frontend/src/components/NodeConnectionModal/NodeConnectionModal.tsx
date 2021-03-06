import React, { useCallback } from 'react';
import { useSelector } from 'react-redux';
import { Modal } from 'react-bootstrap';

import { simulationBridge } from '../../services/simulationBridge';
import { hasValue } from '../../common/utils/hasValue';
import { RootState } from '../../state/RootState';

interface NodeConnectionModalProps {
  closeHandler: () => void;
  simulationUid: string;
  firstNodeUid: string | null;
  secondNodeUid: string | null;
}

const NodeConnectionModal: React.FC<NodeConnectionModalProps> = (props) => {
  const { closeHandler, simulationUid, firstNodeUid, secondNodeUid } = props;

  const connection = useSelector((state: RootState) => {
    return !hasValue(firstNodeUid) || !hasValue(secondNodeUid)
      ? null
      : state.simulation[simulationUid].connectionMap.connectionMap[
          firstNodeUid
        ][secondNodeUid];
  });

  const handleLatencyInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (!hasValue(connection)) {
        throw new Error(
          `handleLatencyInputChange called but connection is ${connection}`
        );
      }

      let newLatencyInMs = Number.parseFloat(e.target.value);
      if (!Number.isFinite(newLatencyInMs) || newLatencyInMs < 0) {
        newLatencyInMs = 10;
      }

      simulationBridge.sendSimulationConnectionChangeLatency(simulationUid, {
        latencyInMs: newLatencyInMs,
        firstNodeUid: connection.firstNodeUid,
        secondNodeUid: connection.secondNodeUid,
      });
    },
    [connection, simulationUid]
  );

  return (
    <Modal
      show={hasValue(connection)}
      onHide={closeHandler}
      onExit={closeHandler}
      backdrop="static"
      keyboard={false}
      size="lg"
      dialogClassName="comp-node-connection-modal"
    >
      <Modal.Header closeButton>
        <Modal.Title>Node Connection Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {!hasValue(connection) ? (
          <span>Connection not found</span>
        ) : (
          <div className="d-flex flex-column align-items-center">
            <div>
              <p>
                1st node: <code>{connection.firstNodeUid}</code>
              </p>
              <p>
                2nd node: <code>{connection.secondNodeUid}</code>
              </p>
            </div>
            <div className="input-group w-50">
              <div className="input-group-prepend">
                <span className="input-group-text">Latency (ms)</span>
              </div>
              <input
                type="number"
                className="form-control"
                value={connection.latencyInMs}
                step={100}
                onChange={handleLatencyInputChange}
              />
            </div>
          </div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default NodeConnectionModal;
