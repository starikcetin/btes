import _ from 'lodash';
import React from 'react';
import { Card, Col, Row } from 'react-bootstrap';

import './BlockchainTxCard.scss';
import { hasValue } from '../../../common/utils/hasValue';
import { useTxOutputGetter } from '../../../hooks/txGetters/useTxOutputGetter';
import { useTxGetterEverywhere } from '../../../hooks/txGetters/useTxGetterEverywhere';
import { BlockchainTx } from '../../../common/blockchain/tx/BlockchainTx';
import { hashTx } from '../../../common/blockchain/utils/hashTx';

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

  return (
    <div className="comp-blockchain-tx-card">
      <Card>
        <Card.Header>
          Transaction <code>{txHash}</code>
        </Card.Header>
        <Card.Body>
          <Row>
            <Col>Fee: {fee}</Col>
          </Row>
          <Row>
            <Col lg={6} className="border-lg-right">
              {inputs.length} Inputs (Total: {inputSum})
            </Col>
            <Col lg={6}>
              {outputs.length} Outputs (Total: {outputSum})
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </div>
  );
};
