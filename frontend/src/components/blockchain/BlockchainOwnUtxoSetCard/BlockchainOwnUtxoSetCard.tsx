import _ from 'lodash';
import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { Button, Card, Form, InputGroup } from 'react-bootstrap';

import './BlockchainOwnUtxoSetCard.scss';
import { RootState } from '../../../state/RootState';
import { hasValue } from '../../../common/utils/hasValue';
import { BlockchainKeyPair } from '../../../common/blockchain/crypto/BlockchainKeyPair';
import { decodeString } from '../../../common/blockchain/utils/decodeString';
import { createKeyPair } from '../../../common/blockchain/utils/createKeyPair';
import { verifyPrivateKey } from '../../../common/crypto/verifyPrivateKey';
import { simulationBridge } from '../../../services/simulationBridge';
import { BlockchainTxOutPoint } from '../../../common/blockchain/tx/BlockchainTxOutPoint';
import { useTxOutputGetter } from '../../../hooks/txGetters/useTxOutputGetter';
import { useTxGetterEverywhere } from '../../../hooks/txGetters/useTxGetterEverywhere';
import { txGetPlaceToDisplayString } from '../../../utils/txGetPlaceToDisplayString';

interface BlockchainOwnUtxoSetCardProps {
  simulationUid: string;
  nodeUid: string;
}

export const BlockchainOwnUtxoSetCard: React.FC<BlockchainOwnUtxoSetCardProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  const ownUtxoSet = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.wallet
        .ownUtxoSet
  );

  const outputGetter = useTxOutputGetter(useTxGetterEverywhere({ ...props }));

  const renderOutpointEntryContent = (outpoint: BlockchainTxOutPoint) => {
    const outputLookup = outputGetter(outpoint);
    return (
      <>
        <div>
          Value: <code>{outputLookup?.output?.value ?? '?'}</code>{' '}
          <small className="text-muted">(value of the referenced output)</small>
        </div>
        <div>
          Transaction Hash:{' '}
          <code className="global-break-all">{outpoint.txHash}</code>
        </div>
        <div>
          Output Index: <code>{outpoint.outputIndex}</code>
        </div>
        <div>
          <small className="text-muted">
            {hasValue(outputLookup)
              ? txGetPlaceToDisplayString(outputLookup.place)
              : 'Transaction not found.'}
          </small>
        </div>
      </>
    );
  };

  const renderOutpointEntries = () => {
    return ownUtxoSet.map((outpoint, index) => (
      <>
        <hr />
        <div key={index}>{renderOutpointEntryContent(outpoint)}</div>
      </>
    ));
  };

  return (
    <div>
      <Card>
        <Card.Header>
          Unspent Transaction Outputs ({ownUtxoSet.length})
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <small className="text-muted">
              <div>
                This list shows transaction outputs that this node can spend,
                but has not spent yet. Spending: Referencing a transaction
                output in the input of another transaction.
              </div>
            </small>
          </Card.Text>
          {ownUtxoSet.length <= 0 ? (
            <Card.Text className="text-muted">
              No unspent transaction outputs.
            </Card.Text>
          ) : (
            renderOutpointEntries()
          )}
        </Card.Body>
      </Card>
    </div>
  );
};
