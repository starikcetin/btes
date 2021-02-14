import React from 'react';
import { Modal } from 'react-bootstrap';

import { SimulationLog } from '../../state/simulation/data/SimulationLog';
import LogTable from '../LogTable/LogTable';

interface LogModalProps {
  closeHandler: () => void;
  show: boolean;
  logs: SimulationLog[];
}

const LogModal: React.FC<LogModalProps> = (props) => {
  const { closeHandler, show, logs } = props;

  return (
    <Modal
      show={show}
      onHide={closeHandler}
      backdrop="static"
      keyboard={false}
      size="lg"
    >
      <Modal.Header closeButton>
        <Modal.Title>Logs</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <LogTable logs={logs} />
      </Modal.Body>
    </Modal>
  );
};

export default LogModal;
