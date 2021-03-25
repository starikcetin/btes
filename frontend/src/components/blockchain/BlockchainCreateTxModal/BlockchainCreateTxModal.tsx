import _ from 'lodash';
import React from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { useArray } from 'react-hanger';
import { useSelector } from 'react-redux';

import { BlockchainTxOutput } from '../../../common/blockchain/tx/BlockchainTxOutput';
import { BlockchainTxInput } from '../../../common/blockchain/tx/BlockchainTxInput';
import { BlockchainTxOutPoint } from '../../../../../common/src/blockchain/tx/BlockchainTxOutPoint';
import { RootState } from '../../../state/RootState';
import { hasValue } from '../../../common/utils/hasValue';
import { BlockchainTx } from '../../../common/blockchain/tx/BlockchainTx';

interface BlockchainCreateTxModalProps {
  show: boolean;
  closeHandler: () => void;
  simulationUid: string;
  nodeUid: string;
}

const BlockchainCreateTxModal: React.FC<BlockchainCreateTxModalProps> = (
  props
) => {
  const { show, closeHandler, simulationUid, nodeUid } = props;

  const mainBranchTxLookup = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.blockDb
        .mainBranchTxLookup
  );
  const sideBranchesTxLookup = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.blockDb
        .sideBranchesTxLookup
  );
  const blockOrphanageTxLookup = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.blockDb
        .orphanageTxLookup
  );
  const mempoolTxLookup = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.txDb
        .mempoolTxLookup
  );
  const txOrphanageTxLookup = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.txDb
        .orphanageTxLookup
  );

  const inputs = useArray<BlockchainTxInput>([]);
  const outputs = useArray<BlockchainTxOutput>([]);

  const getTx = (
    txHash: string
  ):
    | { place: 'nowhere' }
    | {
        place:
          | 'main-branch'
          | 'side-branch'
          | 'block-orphanage'
          | 'mempool'
          | 'tx-orphanage';
        tx: BlockchainTx;
      } =>
    hasValue(mainBranchTxLookup[txHash])
      ? {
          place: 'main-branch',
          tx: mainBranchTxLookup[txHash],
        }
      : hasValue(mempoolTxLookup[txHash])
      ? {
          place: 'mempool',
          tx: mempoolTxLookup[txHash],
        }
      : hasValue(txOrphanageTxLookup[txHash])
      ? {
          place: 'tx-orphanage',
          tx: txOrphanageTxLookup[txHash],
        }
      : hasValue(blockOrphanageTxLookup[txHash])
      ? {
          place: 'block-orphanage',
          tx: blockOrphanageTxLookup[txHash],
        }
      : hasValue(sideBranchesTxLookup[txHash])
      ? {
          place: 'side-branch',
          tx: sideBranchesTxLookup[txHash],
        }
      : { place: 'nowhere' };

  const getOutput = (
    outPoint: BlockchainTxOutPoint
  ): BlockchainTxOutput | null => {
    const txLookup = getTx(outPoint.txHash);

    return txLookup.place === 'nowhere'
      ? null
      : txLookup.tx.outputs[outPoint.outputIndex];
  };

  const outputSum = _.sumBy(outputs.value, (o) => o.value);

  /** NaN if one of the outputs cannot be found. */
  const inputSum = _.sumBy(inputs.value, (i) => {
    if (i.isCoinbase) {
      return 0;
    }

    const output = getOutput(i.previousOutput);
    return hasValue(output) ? output.value : Number.NaN;
  });

  return (
    <Modal
      show={show}
      onHide={closeHandler}
      backdrop="static"
      keyboard={false}
      size="xl"
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title>New Transaction</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Row>
          <Col lg={6}>
            <Card border="success">
              <Card.Header>Inputs</Card.Header>
              <Card.Body>
                <Card.Text>Inputs here.</Card.Text>
              </Card.Body>
              <Card.Footer>Total: +{inputSum}</Card.Footer>
            </Card>
          </Col>

          <Col lg={6} className="mt-4 mt-lg-0">
            <Card border="danger">
              <Card.Header>Outputs</Card.Header>
              <Card.Body>
                <Card.Text>Outputs here.</Card.Text>
              </Card.Body>
              <Card.Footer>Total: -{outputSum}</Card.Footer>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col lg={12}>
            <Card border="info">
              <Card.Header>Properties</Card.Header>
              <Card.Body>
                <Card.Text>Is coinbase?</Card.Text>
                <Card.Text>Hash: sadhafhjfjhafjkd</Card.Text>
                <Card.Text>Transaction fee: 9.00</Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center align-items-center">
        <Button variant="success" className="mr-3">
          Create and Broadcast
        </Button>
        <Button variant="danger">Discard</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BlockchainCreateTxModal;
