import _ from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';

import './BlockchainKeyPairCard.scss';
import { RootState } from '../../../state/RootState';
import { hasValue } from '../../../common/utils/hasValue';
import { BlockchainKeyPair } from '../../../common/blockchain/crypto/BlockchainKeyPair';
import { decodeString } from '../../../common/blockchain/utils/decodeString';
import { createKeyPair } from '../../../common/blockchain/utils/createKeyPair';
import { verifyPrivateKey } from '../../../common/crypto/verifyPrivateKey';
import { simulationBridge } from '../../../services/simulationBridge';

interface BlockchainKeyPairCardProps {
  simulationUid: string;
  nodeUid: string;
}

export const BlockchainKeyPairCard: React.FC<BlockchainKeyPairCardProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  const [localKeyPair, setLocalKeyPair] = useState<BlockchainKeyPair>({
    privateKey: '',
    publicKey: '',
    address: '',
  });

  const keyPair = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.wallet
        .keyPair
  );

  const privateKeyValue = hasValue(keyPair)
    ? keyPair.privateKey
    : localKeyPair?.privateKey;

  const publicKeyValue = hasValue(keyPair)
    ? keyPair.publicKey
    : localKeyPair?.publicKey;

  const addressValue = hasValue(keyPair)
    ? keyPair.address
    : localKeyPair?.address;

  const hasKeyPair = hasValue(keyPair);

  const isLocalValid =
    hasValue(localKeyPair?.address) && !_.isEmpty(localKeyPair?.address);

  const generateKeyPair = (priv?: Buffer) => {
    const newKeyPair = createKeyPair(priv);
    setLocalKeyPair(newKeyPair);
  };

  const handlePrivateKeyChange: React.ChangeEventHandler<HTMLInputElement> = (
    event
  ) => {
    const privateEncoded = event.target.value;

    try {
      const privateBuffer = decodeString(privateEncoded, 'address');
      const isPrivateValid = verifyPrivateKey(privateBuffer);

      if (isPrivateValid) {
        generateKeyPair(privateBuffer);
        return;
      }
    } catch {
      console.log('invalid priv key: ' + privateEncoded);
    }

    setLocalKeyPair({
      privateKey: privateEncoded,
      publicKey: '',
      address: '',
    });
  };

  const saveKeypair = () => {
    simulationBridge.sendBlockchainSaveKeyPair(simulationUid, {
      nodeUid,
      keyPair: localKeyPair,
    });
  };

  return (
    <div>
      <Card>
        <Card.Header>Key Pair</Card.Header>
        <Card.Body>
          <InputGroup className="mb-1">
            <InputGroup.Prepend>
              <InputGroup.Text className="comp-blockchain-key-pair-card--key-prepend">
                Private Key
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              disabled={hasKeyPair}
              type="text"
              placeholder="Private key in base58 format..."
              value={privateKeyValue}
              onChange={handlePrivateKeyChange}
              className="text-monospace"
            />
            <InputGroup.Append></InputGroup.Append>
          </InputGroup>
          <InputGroup className="mb-1">
            <InputGroup.Prepend>
              <InputGroup.Text className="comp-blockchain-key-pair-card--key-prepend">
                Public Key
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              disabled
              type="text"
              placeholder="Public key in base58 format"
              value={publicKeyValue}
              className="text-monospace"
            />
          </InputGroup>
          <InputGroup>
            <InputGroup.Prepend>
              <InputGroup.Text className="comp-blockchain-key-pair-card--key-prepend">
                Address
              </InputGroup.Text>
            </InputGroup.Prepend>
            <Form.Control
              disabled
              type="text"
              placeholder="P2PKH address in base58 format"
              value={addressValue}
              className="text-monospace"
            />
          </InputGroup>
          <Form.Text className="text-muted">
            This simulation only supports <b>P2PKH</b> (pay to public key hash)
            script pattern.
          </Form.Text>
        </Card.Body>
        <Card.Footer>
          {hasKeyPair ? (
            <small>
              <Card.Text className="text-muted">
                In this simulation, key pairs are permanent after they are
                locked, for simplicity. Please note that in real-life, not only
                would you be able to change your key pairs whenever you want,
                but it is actually encouraged to use a new key pair for each new
                transaction.
              </Card.Text>
            </small>
          ) : (
            <div className="d-flex justify-content-center align-items-center">
              <Button
                variant="warning"
                onClick={() => saveKeypair()}
                disabled={!isLocalValid}
                className="mr-3"
              >
                Save and Lock
              </Button>
              <Button variant="success" onClick={() => generateKeyPair()}>
                Generate
              </Button>
            </div>
          )}
        </Card.Footer>
      </Card>
    </div>
  );
};
