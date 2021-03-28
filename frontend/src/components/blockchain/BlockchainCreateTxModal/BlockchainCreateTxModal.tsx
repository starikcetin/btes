import _ from 'lodash';
import React from 'react';
import { Button, Card, Col, Modal, Row } from 'react-bootstrap';
import { useArray } from 'react-hanger';

import { BlockchainTxOutput } from '../../../common/blockchain/tx/BlockchainTxOutput';
import { BlockchainTxInput } from '../../../common/blockchain/tx/BlockchainTxInput';
import { hasValue } from '../../../common/utils/hasValue';
import { useTxGetter } from './hooks/useTxGetter';
import { useTxOutputGetter } from './hooks/useTxOutputGetter';
import { BlockchainTxInputForm } from './comps/BlockchainTxInputForm/BlockchainTxInputForm';
import { BlockchainTxOutputForm } from './comps/BlockchainTxOutputForm/BlockchainTxOutputForm';
import { makeDefaultTxOutput } from './makeDefaultTxOutput';
import { makeDefaultTxInput } from './makeDefaultTxInput';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

  const inputs = useArray<BlockchainTxInput>([]);
  const outputs = useArray<BlockchainTxOutput>([]);

  const getTx = useTxGetter({ simulationUid, nodeUid });
  const getOutput = useTxOutputGetter(getTx);

  const outputSum = _.sumBy(outputs.value, (o) => o.value);

  /** NaN if one of the outputs cannot be found. */
  const inputSum = _.sumBy(inputs.value, (i) => {
    if (i.isCoinbase) {
      return 0;
    }

    const getResult = getOutput(i.previousOutput);
    return getResult.place !== 'nowhere' && hasValue(getResult.output)
      ? getResult.output.value
      : Number.NaN;
  });

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
                  <div className={index === 0 ? '' : 'mt-3'} key={index}>
                    <BlockchainTxInputForm
                      value={input}
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
                  <div className={index === 0 ? '' : 'mt-3'} key={index}>
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
