import React from 'react';
import { useSelector } from 'react-redux';
import { Card } from 'react-bootstrap';

import './BlockchainOwnUtxoSetCard.scss';
import { RootState } from '../../../state/RootState';
import { hasValue } from '../../../common/utils/hasValue';
import { BlockchainTxOutPoint } from '../../../common/blockchain/tx/BlockchainTxOutPoint';
import { useTxOutputGetter } from '../../../hooks/txGetters/useTxOutputGetter';
import { useTxGetterEverywhere } from '../../../hooks/txGetters/useTxGetterEverywhere';
import { txGetPlaceToDisplayString } from '../../../utils/txGetPlaceToDisplayString';
import { useFundsCalculator } from '../../../hooks/useFundsCalculator';
import { useKeyGenerator } from '../../../hooks/useKeyGenerator';

interface BlockchainOwnUtxoSetCardProps {
  simulationUid: string;
  nodeUid: string;
}

export const BlockchainOwnUtxoSetCard: React.FC<BlockchainOwnUtxoSetCardProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  const keyGen = useKeyGenerator();

  const ownUtxoSet = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.wallet
        .ownUtxoSet
  );

  const outputGetter = useTxOutputGetter(useTxGetterEverywhere({ ...props }));
  const fundsCalculator = useFundsCalculator(outputGetter);

  const totalFunds = fundsCalculator(ownUtxoSet);

  const renderUtxo = (utxo: BlockchainTxOutPoint, index: number) => {
    const outputLookup = outputGetter(utxo);

    return (
      <div key={keyGen(utxo, index)}>
        <hr />
        <div>
          Value: <code>{outputLookup?.output?.value ?? '?'}</code>{' '}
          <small className="text-muted">(value of the referenced output)</small>
        </div>
        <div>
          Transaction Hash:{' '}
          <code className="global-break-all">{utxo.txHash}</code>
        </div>
        <div>
          Output Index: <code>{utxo.outputIndex}</code>
        </div>
        <div>
          <small className="text-muted">
            {hasValue(outputLookup)
              ? txGetPlaceToDisplayString(outputLookup.place)
              : 'Transaction not found.'}
          </small>
        </div>
      </div>
    );
  };

  return (
    <div>
      <Card>
        <Card.Header>
          Unspent Transaction Outputs ({ownUtxoSet.length})
          <span className="float-right">
            Total funds: <code>{isNaN(totalFunds) ? '?' : totalFunds}</code>
          </span>
        </Card.Header>
        <Card.Body>
          <Card.Text>
            <small className="text-muted">
              This list shows transaction outputs that this node can spend, but
              has not spent yet. Outputs are considered spent when they are
              referenced by an input of another valid transaction.
            </small>
          </Card.Text>
          {ownUtxoSet.length <= 0 ? (
            <div>
              <hr />
              <Card.Text className="text-muted">
                No unspent transaction outputs.
              </Card.Text>
            </div>
          ) : (
            ownUtxoSet.map(renderUtxo)
          )}
        </Card.Body>
      </Card>
    </div>
  );
};
