import React from 'react';
import { useSelector } from 'react-redux';

import './BlockchainMinerPane.scss';
import { RootState } from '../../../state/RootState';
import { BlockchainMinerPaneStatusBar } from './comps/StatusBar/BlockchainMinerPaneStatusBar';
import { BlockchainMinerIdleView } from './comps/IdleView/BlockchainMinerIdleView';
import { BlockchainMinerStoppedView } from './comps/StoppedView/BlockchainMinerStoppedView';
import { BlockchainMinerWorkingView } from './comps/WorkingView/BlockchainMinerWorkingView';
import { Row, Col, Container } from 'react-bootstrap';

interface BlockchainMinerPaneProps {
  simulationUid: string;
  nodeUid: string;
}

export const BlockchainMinerPane: React.FC<BlockchainMinerPaneProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  const { currentState } = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.miner
  );

  const getStateView = () => {
    switch (currentState.state) {
      case 'idle':
        return <BlockchainMinerIdleView state={currentState} />;
      case 'working':
        return <BlockchainMinerWorkingView state={currentState} />;
      case 'stopped':
        return <BlockchainMinerStoppedView state={currentState} />;
    }
  };

  return (
    <div className="comp-blockchain-miner-pane">
      <BlockchainMinerPaneStatusBar {...props} />
      {getStateView()}
    </div>
  );
};
