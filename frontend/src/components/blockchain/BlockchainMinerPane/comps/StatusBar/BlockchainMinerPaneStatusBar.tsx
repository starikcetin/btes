import React from 'react';
import { useSelector } from 'react-redux';
import { Variant } from 'react-bootstrap/esm/types';
import { Alert } from 'react-bootstrap';
import { capitalize } from 'lodash';

import { RootState } from '../../../../../state/RootState';

export const BlockchainMinerPaneStatusBar: React.FC<{
  simulationUid: string;
  nodeUid: string;
}> = (props) => {
  const { simulationUid, nodeUid } = props;

  const { currentState } = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.miner
  );

  const getAlertVariant = (): Variant => {
    switch (currentState.state) {
      case 'idle':
        return 'secondary';
      case 'working':
        return 'primary';
      case 'stopped':
        switch (currentState.stopReason) {
          case 'success':
            return 'success';
          case 'aborted':
            return 'danger';
        }
    }
  };

  const stateText = capitalize(currentState.state.split('-').join(' '));

  return (
    <Alert variant={getAlertVariant()} className="p-2">
      State: {stateText}
      {currentState.state === 'stopped' &&
        `, Reason: ${capitalize(currentState.stopReason)}`}
    </Alert>
  );
};
