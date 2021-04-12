import _ from 'lodash';
import React from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { useArray } from 'react-hanger';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { BlockchainTxOutput } from '../../../common/blockchain/tx/BlockchainTxOutput';
import { BlockchainTxInput } from '../../../common/blockchain/tx/BlockchainTxInput';
import { useTxOutputGetter } from '../../../hooks/txGetters/useTxOutputGetter';
import { BlockchainTxInputForm } from './comps/BlockchainTxInputForm/BlockchainTxInputForm';
import { BlockchainTxOutputForm } from './comps/BlockchainTxOutputForm/BlockchainTxOutputForm';
import { makeDefaultTxOutput } from '../../../utils/makeDefaultTxOutput';
import { makeDefaultTxInput } from '../../../utils/makeDefaultTxInput';
import { makePartialTx } from '../../../common/blockchain/utils/makePartialTx';
import { hashJsonObj } from '../../../common/crypto/hashJsonObj';
import { hashTx } from '../../../common/blockchain/utils/hashTx';
import { simulationBridge } from '../../../services/simulationBridge';
import { useTxGetterEverywhere } from '../../../hooks/txGetters/useTxGetterEverywhere';
import { useTxInputSumCalculator } from '../../../hooks/useTxInputSumCalculator';
import { useTxOutputSumCalculator } from '../../../hooks/useTxOutputSumCalculator';

interface BlockchainCreateTxModalProps {
  show: boolean;
  closeHandler: () => void;
  simulationUid: string;
  nodeUid: string;
}

// TODO: reset state on close (separating the modal and the content might be the way to go)
const BlockchainCreateTxModal: React.FC<BlockchainCreateTxModalProps> = (
  props
) => {
  const { show, closeHandler, simulationUid, nodeUid } = props;

  const inputs = useArray<BlockchainTxInput>([]);
  const outputs = useArray<BlockchainTxOutput>([]);

  const getTx = useTxGetterEverywhere({ simulationUid, nodeUid });
  const getOutput = useTxOutputGetter(getTx);
  const inputSumCalculator = useTxInputSumCalculator(getOutput);
  const outputSumCalculator = useTxOutputSumCalculator();

  const outputSum = outputSumCalculator(outputs.value);

  /** NaN if one of the outputs cannot be found. */
  const inputSum = inputSumCalculator(inputs.value);

  const handleTxInputFormChange = (
    inputIndex: number,
    newValue: BlockchainTxInput
  ) => {
    inputs.removeIndex(inputIndex);
    inputs.push(newValue);
    inputs.move(inputs.value.length - 1, inputIndex);
  };

  const handleTxOutputFormChange = (
    outputIndex: number,
    newValue: BlockchainTxOutput
  ) => {
    outputs.removeIndex(outputIndex);
    outputs.push(newValue);
    outputs.move(outputs.value.length - 1, outputIndex);
  };

  const addInput = () => {
    inputs.push(makeDefaultTxInput(false));
  };

  const addOutput = () => {
    outputs.push(makeDefaultTxOutput());
  };

  const handleTxInputRemove = (index: number) => {
    inputs.removeIndex(index);
  };

  const handleTxOutputRemove = (index: number) => {
    outputs.removeIndex(index);
  };

  const fullTx = { inputs: inputs.value, outputs: outputs.value };
  const encodedFullTxHash = hashTx(fullTx);

  const partialTx = makePartialTx(fullTx);
  const decodedPartialTxHash = hashJsonObj(partialTx);

  const sendAndClose = () => {
    simulationBridge.sendBlockchainBroadcastTx(simulationUid, {
      nodeUid,
      tx: fullTx,
    });

    closeHandler();
  };

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
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span>Inputs</span>
                <Button
                  className="pt-0 pb-0"
                  size="sm"
                  variant="success"
                  onClick={addInput}
                >
                  <FontAwesomeIcon icon={faPlus} size="sm" />
                </Button>
              </Card.Header>
              <Card.Body>
                {inputs.value.map((input, index) => (
                  <div className="mt-3 global-first-mt-0" key={index}>
                    <BlockchainTxInputForm
                      value={input}
                      partialTxHash={decodedPartialTxHash}
                      onChange={(v) => handleTxInputFormChange(index, v)}
                      onRemove={() => handleTxInputRemove(index)}
                    />
                  </div>
                ))}
              </Card.Body>
              <Card.Footer>
                Total: {isNaN(inputSum) ? '?' : inputSum}
              </Card.Footer>
            </Card>
          </Col>

          <Col lg={6} className="mt-4 mt-lg-0">
            <Card border="danger">
              <Card.Header className="d-flex justify-content-between align-items-center">
                <span>Outputs</span>
                <Button
                  className="pt-0 pb-0"
                  size="sm"
                  variant="success"
                  onClick={addOutput}
                >
                  <FontAwesomeIcon icon={faPlus} size="sm" />
                </Button>
              </Card.Header>
              <Card.Body>
                {outputs.value.map((output, index) => (
                  <div className="mt-3 global-first-mt-0" key={index}>
                    <BlockchainTxOutputForm
                      value={output}
                      onChange={(v) => handleTxOutputFormChange(index, v)}
                      onRemove={() => handleTxOutputRemove(index)}
                    />
                  </div>
                ))}
              </Card.Body>
              <Card.Footer>Total: {outputSum}</Card.Footer>
            </Card>
          </Col>
        </Row>

        <Row className="mt-4">
          <Col lg={12}>
            <Card border="info">
              <Card.Header>Properties</Card.Header>
              <Card.Body>
                <Card.Text>Hash: {encodedFullTxHash}</Card.Text>
                <Card.Text>
                  Transaction fee:{' '}
                  {isNaN(inputSum) ? '?' : inputSum - outputSum}
                </Card.Text>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Modal.Body>
      <Modal.Footer className="d-flex justify-content-center align-items-center">
        <Button variant="success" className="mr-3" onClick={sendAndClose}>
          Create and Broadcast
        </Button>
        <Button variant="danger" onClick={closeHandler}>
          Discard
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BlockchainCreateTxModal;
