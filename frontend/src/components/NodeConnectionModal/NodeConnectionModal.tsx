import React, { useCallback, useEffect, useState } from 'react';
import { NodeConnectionData } from '../../state/simulation/data/ConnectionData';
import { Modal } from 'react-bootstrap';
import { simulationBridge } from '../../services/simulationBridge';

interface NodeConnectionModalProps {
  closeHandler: () => void;
  onConnectionLatencyChange: (newValue: number) => void;
  simulationUid: string;
  connection: NodeConnectionData | null;
}

const NodeConnectionModal: React.FC<NodeConnectionModalProps> = (props) => {
  const {
    closeHandler,
    simulationUid,
    connection,
    onConnectionLatencyChange,
  } = props;

  const handleLatencyInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = Number.parseFloat(e.target.value);
      if (!Number.isFinite(newValue) || newValue < 0) {
        newValue = 10;
      }

      simulationBridge.sendSimulationConnectionChangeLatency(simulationUid, {
        latencyInMs: newValue,
        firstNodeUid: connection!.firstNodeUid,
        secondNodeUid: connection!.secondNodeUid,
      });
      onConnectionLatencyChange(newValue);
    },
    [connection, onConnectionLatencyChange, simulationUid]
  );

  return (
    <Modal
      show={!!connection}
      onHide={closeHandler}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      {' '}
      <Modal.Header closeButton>
        <Modal.Title>Node Connection Details</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container w-50">
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text" id="">
                Connection from
              </span>
            </div>
            <input
              type="text"
              className="form-control"
              value={connection?.firstNodeUid}
              disabled={true}
            />
            <div className="input-group-prepend">
              <span className="input-group-text" id="">
                to
              </span>
            </div>
            <input
              type="text"
              className="form-control alert-success"
              value={connection?.secondNodeUid}
              disabled={true}
            />
          </div>
          <div className="input-group">
            <div className="input-group-prepend">
              <span className="input-group-text" id="">
                Latency
              </span>
            </div>
            <input
              type="number"
              className="form-control"
              value={connection?.latencyInMs}
              step={100}
              onChange={handleLatencyInputChange}
            />
          </div>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default NodeConnectionModal;
