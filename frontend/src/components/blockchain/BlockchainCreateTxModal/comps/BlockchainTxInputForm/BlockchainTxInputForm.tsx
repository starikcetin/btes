import React from 'react';
import { Card, Form } from 'react-bootstrap';

import { BlockchainTxInput } from '../../../../../common/blockchain/tx/BlockchainTxInput';
import { BlockchainCoinbaseTxInput } from '../../../../../../../backend/src/common/blockchain/tx/BlockchainCoinbaseTxInput';
import { BlockchainRegularTxInput } from '../../../../../common/blockchain/tx/BlockchainRegularTxInput';
import { makeDefaultTxInput } from '../../makeDefaultTxInput';

interface BlockchainTxInputFormProps {
  readonly value: BlockchainTxInput;
  readonly onChange: (value: BlockchainTxInput) => void;
}

export const BlockchainTxInputForm: React.FC<BlockchainTxInputFormProps> = (
  props
) => {
  const { value: curVal, onChange } = props;

  const changeIsCoinbase = (newVal: boolean) => {
    onChange(makeDefaultTxInput(newVal));
  };

  const changeCoinbase = (newVal: string) => {
    if (curVal.isCoinbase === false) {
      throw new Error("cannot change 'coinbase' of a regular tx!");
    }

    onChange({
      ...curVal,
      coinbase: newVal,
    });
  };

  const changeTxHash = (newVal: string) => {
    if (curVal.isCoinbase === true) {
      throw new Error("cannot change 'txHash' of a coinbase tx!");
    }

    onChange({
      ...curVal,
      previousOutput: { ...curVal.previousOutput, txHash: newVal },
    });
  };

  const changeOutputIndex = (newVal: string) => {
    if (curVal.isCoinbase === true) {
      throw new Error("cannot change 'outputIndex' of a coinbase tx!");
    }

    let parsed = Number.parseInt(newVal);
    if (!Number.isSafeInteger(parsed) || parsed < 0) {
      parsed = 0;
    }

    onChange({
      ...curVal,
      previousOutput: { ...curVal.previousOutput, outputIndex: parsed },
    });
  };

  const renderCoinbaseFields = (curValue: BlockchainCoinbaseTxInput) => {
    return (
      <Form>
        <Form.Group>
          <Form.Label>Coinbase</Form.Label>
          <Form.Control
            as="textarea"
            rows={2}
            value={curValue.coinbase}
            onChange={(e) => changeCoinbase(e.target.value)}
          />
        </Form.Group>
      </Form>
    );
  };

  const renderRegularFields = (curValue: BlockchainRegularTxInput) => {
    return (
      <Form>
        <Form.Group>
          <Form.Label>
            Previous <abbr title="Transaction">Tx</abbr> Hash
          </Form.Label>
          <Form.Control
            type="text"
            value={curValue.previousOutput.txHash}
            onChange={(e) => changeTxHash(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>
            Previous <abbr title="Transaction">Tx</abbr> Output Index
          </Form.Label>
          <Form.Control
            type="number"
            min={0}
            value={curValue.previousOutput.outputIndex}
            onChange={(e) => changeOutputIndex(e.target.value)}
          />
        </Form.Group>
      </Form>
    );
  };

  return (
    <Card>
      <Card.Header></Card.Header>
      <Card.Body>
        <Form.Group>
          <Form.Check
            type="checkbox"
            label="Is coinbase?"
            checked={curVal.isCoinbase}
            onChange={(e) => changeIsCoinbase(e.target.checked)}
          />
        </Form.Group>
        {curVal.isCoinbase
          ? renderCoinbaseFields(curVal)
          : renderRegularFields(curVal)}
      </Card.Body>
      <Card.Footer></Card.Footer>
    </Card>
  );
};
