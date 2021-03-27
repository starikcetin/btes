import React from 'react';
import { Card, Form } from 'react-bootstrap';

import { BlockchainTxOutput } from '../../../../../common/blockchain/tx/BlockchainTxOutput';

interface BlockchainTxOutputFormProps {
  readonly value: BlockchainTxOutput;
  readonly onChange: (value: BlockchainTxOutput) => void;
}

export const BlockchainTxOutputForm: React.FC<BlockchainTxOutputFormProps> = (
  props
) => {
  const { value: curVal, onChange } = props;

  const changeValue = (newVal: string) => {
    let parsed = Number.parseInt(newVal);
    if (!Number.isSafeInteger(parsed) || parsed < 0) {
      parsed = 0;
    }

    onChange({
      ...curVal,
      value: parsed,
    });
  };

  const changeAddress = (newVal: string) => {
    onChange({
      ...curVal,
      lockingScript: { ...curVal.lockingScript, address: newVal },
    });
  };

  return (
    <Card>
      <Card.Body>
        <Form>
          <Form.Group>
            <Form.Label>Recipient Address</Form.Label>
            <Form.Control
              type="text"
              value={curVal.lockingScript.address}
              onChange={(e) => changeAddress(e.target.value)}
            />
          </Form.Group>
          <Form.Group>
            <Form.Label>Value</Form.Label>
            <Form.Control
              type="number"
              min={0}
              value={curVal.value}
              onChange={(e) => changeValue(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Card.Body>
    </Card>
  );
};
