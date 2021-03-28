import React, { useState } from 'react';
import { Button, Card, Form } from 'react-bootstrap';
import { faMinus } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import useDeepCompareEffect from 'use-deep-compare-effect';

import { BlockchainTxInput } from '../../../../../common/blockchain/tx/BlockchainTxInput';
import { BlockchainCoinbaseTxInput } from '../../../../../common/blockchain/tx/BlockchainCoinbaseTxInput';
import { BlockchainRegularTxInput } from '../../../../../common/blockchain/tx/BlockchainRegularTxInput';
import { makeDefaultTxInput } from '../../makeDefaultTxInput';
import { createPublicKey } from '../../../../../common/crypto/createPublicKey';
import { decodeString } from '../../../../../common/blockchain/utils/decodeString';
import { encodeBuffer } from '../../../../../common/blockchain/utils/encodeBuffer';
import { createSignature } from '../../../../../common/crypto/createSignature';
import { verifyPrivateKey } from '../../../../../common/crypto/verifyPrivateKey';

interface BlockchainTxInputFormProps {
  readonly value: BlockchainTxInput;
  readonly partialTxHash: Buffer;
  readonly onChange: (value: BlockchainTxInput) => void;
  readonly onRemove: () => void;
}

export const BlockchainTxInputForm: React.FC<BlockchainTxInputFormProps> = (
  props
) => {
  const { value: curVal, partialTxHash, onChange, onRemove } = props;

  const [privateKey, setPrivateKey] = useState('');

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

  const changePrivateKey = (newVal: string) => {
    if (curVal.isCoinbase === true) {
      throw new Error("cannot change 'privateKey' of a coinbase tx!");
    }

    setPrivateKey(newVal);
  };

  // update public key and signature
  useDeepCompareEffect(() => {
    // do not run if coinbase
    if (curVal.isCoinbase === true) {
      return;
    }

    const decodedPrivateKey = decodeString(privateKey, 'address');

    // do not attempt to calculate public key and signature if private key is not valid
    if (!verifyPrivateKey(decodedPrivateKey)) {
      onChange({
        ...curVal,
        unlockingScript: {
          publicKey: '',
          signature: '',
        },
      });

      return;
    }

    const decodedPublicKey = createPublicKey(decodedPrivateKey);
    const encodedPublicKey = encodeBuffer(decodedPublicKey, 'address');
    const decodedSignature = createSignature(partialTxHash, decodedPrivateKey);
    const encodedSignature = encodeBuffer(decodedSignature, 'signature');

    onChange({
      ...curVal,
      unlockingScript: {
        publicKey: encodedPublicKey,
        signature: encodedSignature,
      },
    });
    // Rule exception reasons:
    // - curVal: When curVal changes, partialTxHash also changes, so it is redundant to
    //           check both. Also, curVal is an object, therefore it will also go in the
    //           deep comparison, which is expensive.
    // - onChange: Has the potential to change every render. Can be optimized on the parent
    //             component with useCallback, but it requires some work. Also, it does not
    //             make sense to run this effect when onChange changes, we will be using the
    //             most up-to-date version regardless.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [partialTxHash, privateKey]);

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
            className="text-monospace"
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
        <Form.Group>
          <Form.Label>Private Key for Unlocking Script</Form.Label>
          <Form.Control
            className="text-monospace"
            type="text"
            placeholder="Base58 encoded private key..."
            value={privateKey}
            onChange={(e) => changePrivateKey(e.target.value)}
          />
        </Form.Group>
        <Form.Group>
          <Form.Label>Public key</Form.Label>
          <Form.Control
            className="text-monospace"
            plaintext
            readOnly
            value={curValue.unlockingScript.publicKey}
          />
        </Form.Group>
        <Form.Group className="mb-0">
          <Form.Label>Signature</Form.Label>
          <Form.Control
            className="text-monospace"
            plaintext
            readOnly
            value={curValue.unlockingScript.signature}
          />
        </Form.Group>
      </Form>
    );
  };

  return (
    <Card>
      <Card.Header className="d-flex justify-content-between align-items-center">
        Input
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
