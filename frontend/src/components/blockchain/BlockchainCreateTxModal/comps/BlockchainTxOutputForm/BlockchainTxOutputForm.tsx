import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React from 'react';
import { Button, Card, Form } from 'react-bootstrap';

import { BlockchainTxOutput } from '../../../../../common/blockchain/tx/BlockchainTxOutput';
import { isBase58Safe } from '../../../../../common/crypto/isBase58Safe';

interface BlockchainTxOutputFormProps {
  readonly value: BlockchainTxOutput;
  readonly onChange: (value: BlockchainTxOutput) => void;
  readonly onRemove: () => void;
}

export const BlockchainTxOutputForm: React.FC<BlockchainTxOutputFormProps> = (
  props
) => {
  const { value: curVal, onChange, onRemove } = props;

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
    if (!isBase58Safe(newVal)) {
      return;
    }

    onChange({
      ...curVal,
      lockingScript: { ...curVal.lockingScript, address: newVal },
    });
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        Output
        <Button
          className="pt-0 pb-0"
          size="sm"
          variant="danger"
          onClick={onRemove}
        >
          <FontAwesomeIcon icon={faMinus} size="sm" />
        </Button>
      </Card.Header>
      <Card.Body>
        <Form>
          <Form.Group>
            <Form.Label>Recipient Address</Form.Label>
            <Form.Control
              type="text"
              value={curVal.lockingScript.address}
              onChange={(e) => changeAddress(e.target.value)}
              title={'In base58 format'}
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
