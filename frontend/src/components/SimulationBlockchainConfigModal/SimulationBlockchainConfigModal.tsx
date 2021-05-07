import React, { SyntheticEvent, useState } from 'react';
import { Modal } from 'react-bootstrap';
import { simulationInstanceService } from '../../services/simulationInstanceService';
import { useHistory } from 'react-router-dom';
import { BlockchainConfig } from '../../common/blockchain/BlockchainConfig';

interface SimulationBlockchainConfigModalProps {
  closeHandler: () => void;
  show: boolean;
}

const SimulationBlockchainConfigModal: React.FC<SimulationBlockchainConfigModalProps> = (
  props
) => {
  const { closeHandler, show } = props;
  const history = useHistory();

  const [blockCreationFee, setBlockCreationFee] = useState(100);
  const [coinbaseMaturity, setCoinbaseMaturity] = useState(5);
  const [targetLeadingZeroCount, setTargetLeadingZeroCount] = useState(3);

  const createSimulation = async (e: SyntheticEvent) => {
    e.preventDefault();
    const body: BlockchainConfig = {
      blockCreationFee,
      targetLeadingZeroCount,
      coinbaseMaturity,
    };
    const simulationUid = await simulationInstanceService.create(body);
    history.push('/sandboxSimulation/' + simulationUid);
  };
  return (
    <Modal
      show={show}
      onHide={closeHandler}
      backdrop="static"
      keyboard={false}
      size="lg"
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title>Simulation Blockchain Configuration</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="container-fluid">
          <form onSubmit={createSimulation}>
            <div className="form-group">
              <label>Block Creation Fee</label>
              <input
                type="number"
                className="form-control"
                aria-describedby="blockCreationFee"
                value={blockCreationFee}
                onChange={(event) => {
                  setBlockCreationFee(parseInt(event.target.value));
                }}
              />
              <small id="blockCreationFee" className="form-text text-muted">
                Fee of the block creation on blockchain
              </small>
            </div>
            <div className="form-group">
              <label>Coinbase Maturity</label>
              <input
                type="number"
                className="form-control"
                aria-describedby="coinbaseMaturity"
                value={coinbaseMaturity}
                onChange={(event) => {
                  setCoinbaseMaturity(parseInt(event.target.value));
                }}
              />
              <small id="coinbaseMaturity" className="form-text text-muted">
                Outputs from coinbase and stakebase transactions cannot be spent
                until the coinbase maturity period has passed
              </small>
            </div>
            <div className="form-group">
              <label>Target Leading Zero Count</label>
              <input
                type="number"
                className="form-control"
                aria-describedby="targetLeadingZeroCount"
                value={targetLeadingZeroCount}
                onChange={(event) => {
                  setTargetLeadingZeroCount(parseInt(event.target.value));
                }}
              />
              <small
                id="targetLeadingZeroCount"
                className="form-text text-muted"
              >
                It is related to hardness of the hash value when block is mining
              </small>
            </div>
            <div className="row d-flex justify-content-center">
              <button type="submit" className="btn btn-success">
                CREATE
              </button>
            </div>
          </form>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default SimulationBlockchainConfigModal;
