import _ from 'lodash';
import React from 'react';
import { Badge, Card, Col, ListGroup, Row } from 'react-bootstrap';

import './BlockchainTxCard.scss';
import { hasValue } from '../../../common/utils/hasValue';
import { useTxOutputGetter } from '../../../hooks/txGetters/useTxOutputGetter';
import { useTxGetterEverywhere } from '../../../hooks/txGetters/useTxGetterEverywhere';
import { BlockchainTx } from '../../../common/blockchain/tx/BlockchainTx';
import { hashTx } from '../../../common/blockchain/utils/hashTx';
import { BlockchainTxInput } from '../../../../../common/src/blockchain/tx/BlockchainTxInput';
import { BlockchainTxOutput } from '../../../../../common/src/blockchain/tx/BlockchainTxOutput';
import { makeCountText } from '../../../utils/makeCountText';

interface BlockchainTxCardProps {
  simulationUid: string;
  nodeUid: string;
  tx: BlockchainTx;
}

export const BlockchainTxCard: React.FC<BlockchainTxCardProps> = (props) => {
  const { simulationUid, nodeUid, tx } = props;
  const { inputs, outputs } = tx;

  const getTx = useTxGetterEverywhere({ simulationUid, nodeUid });
  const getOutput = useTxOutputGetter(getTx);

  const txHash = hashTx(tx);

  const outputSum = _.sumBy(outputs, (o) => o.value);

  /** NaN if one of the outputs cannot be found. */
  const inputSum = _.sumBy(inputs, (i) => {
    if (i.isCoinbase) {
      return 0;
    }

    const getResult = getOutput(i.previousOutput);
    return hasValue(getResult) && hasValue(getResult.output)
      ? getResult.output.value
      : Number.NaN;
  });

  const fee = inputSum - outputSum;

  const feePillVariant = Number.isNaN(fee)
    ? 'warning'
    : fee <= 0
    ? 'danger'
    : 'success';

  const renderInput = (input: BlockchainTxInput) => {
    if (input.isCoinbase) {
      return (
        <ListGroup.Item className="py-2 px-3">
          <div className="mb-1">
            <small className="text-muted">
              This input is coinbase, it doesn't have a value.
            </small>
          </div>
          <div className="mb-1">Coinbase:</div>
          <pre className="border p-1 mb-1">{input.coinbase}</pre>
        </ListGroup.Item>
      );
    }

    const refOutput = getOutput(input.previousOutput);

    return (
      <ListGroup.Item className="py-2 px-3">
        <div className="mb-2">
          Value: <code>{refOutput?.output?.value ?? '?'}</code>{' '}
          <small className="text-muted">(value of the referenced output)</small>
        </div>
        <div className="mb-2">
          Previous tx hash:{' '}
          <code className="global-break-all">
            {input.previousOutput.txHash}
          </code>
        </div>
        <div className="mb-2">
          Previous tx output index:{' '}
          <code className="global-break-all">
            {input.previousOutput.outputIndex}
          </code>
        </div>
        <div className="mb-2">
          Public key:{' '}
          <code className="global-break-all">
            {input.unlockingScript.publicKey}
          </code>
        </div>
        <div>
          Signature:{' '}
          <code className="global-break-all">
            {input.unlockingScript.signature}
          </code>
        </div>
      </ListGroup.Item>
    );
  };

  const renderOutput = (output: BlockchainTxOutput) => {
    return (
      <ListGroup.Item className="py-2 px-3">
        <div className="mb-2">
          Value: <code className="global-break-all">{output.value}</code>
        </div>
        <div>
          Address:{' '}
          <code className="global-break-all">
            {output.lockingScript.address}
          </code>
        </div>
      </ListGroup.Item>
    );
  };

  return (
    <div className="comp-blockchain-tx-card">
      <Card>
        <Card.Header>
          Transaction <code className="global-break-all">{txHash}</code>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>
              <Badge
                variant={feePillVariant}
                className="comp-blockchain-tx-card--standalone-badge"
              >
                Transaction fee:{' '}
                <code className="text-reset">
                  {Number.isNaN(fee) ? '?' : fee}
                </code>
              </Badge>
            </Col>
          </Row>
          <Row className="pt-2 no-gutters">
            <Col lg={6} className="pr-lg-1 mb-2 mb-lg-0">
              <ListGroup>
                <ListGroup.Item className="py-2 px-3" variant="success">
                  {makeCountText(inputs.length, 'Input', {
                    prefix: true,
                    zero: 'No',
                  })}
                  <Badge
                    variant="success"
                    className="float-right comp-blockchain-tx-card--standalone-badge"
                  >
                    Total:{' '}
                    <code className="text-reset">
                      {Number.isNaN(inputSum) ? '?' : inputSum}
                    </code>
                  </Badge>
                </ListGroup.Item>
                {inputs.map(renderInput)}
              </ListGroup>
            </Col>
            <Col lg={6} className="pl-lg-1">
              <ListGroup>
                <ListGroup.Item className="py-2 px-3" variant="danger">
                  {makeCountText(outputs.length, 'Output', {
                    prefix: true,
                    zero: 'No',
                  })}
                  <Badge
                    variant="danger"
                    className="float-right comp-blockchain-tx-card--standalone-badge"
                  >
                    Total: <code className="text-reset">{outputSum}</code>
                  </Badge>
                </ListGroup.Item>
                {outputs.map(renderOutput)}
              </ListGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};
