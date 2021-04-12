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
  const fundsCalculator = useFundsCalculator(outputGetter);

  const totalFunds = fundsCalculator(ownUtxoSet);

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
            <>
              <hr />
              <Card.Text className="text-muted">
                No unspent transaction outputs.
              </Card.Text>
            </>
          ) : (
            ownUtxoSet.map((outpoint) => (
              <>
                <hr />
                <div>{renderOutpointEntryContent(outpoint)}</div>
              </>
            ))
          )}
        </Card.Body>
      </Card>
    </div>
  );
};
