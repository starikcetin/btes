import React, { useState } from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';

import { BlockchainCoinbaseTxInput } from '../../../common/blockchain/tx/BlockchainCoinbaseTxInput';
import { BlockchainTx } from '../../../common/blockchain/tx/BlockchainTx';
import { BlockchainRegularTxInput } from '../../../common/blockchain/tx/BlockchainTxInput';
import { BlockchainTxOutput } from '../../../../../backend/src/common/blockchain/tx/BlockchainTxOutput';
import useArray from 'react-use-array';

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

  const [inputs, manipulateInputs] = useArray<
    BlockchainRegularTxInput | BlockchainCoinbaseTxInput
  >([]);

  const [outputs, manipulateOutputs] = useArray<BlockchainTxOutput>([]);

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
              <Card.Footer>Total: +99.99</Card.Footer>
            </Card>
          </Col>

          <Col lg={6} className="mt-4 mt-lg-0">
            <Card border="danger">
              <Card.Header>Outputs</Card.Header>
              <Card.Body>
                <Card.Text>Outputs here.</Card.Text>
              </Card.Body>
              <Card.Footer>Total: -90.99</Card.Footer>
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
