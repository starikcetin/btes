import React from 'react';
import { useSelector } from 'react-redux';

import './BlockchainMinerPane.scss';
import { RootState } from '../../../state/RootState';
import { BlockchainMinerPaneStatusBar } from './comps/StatusBar/BlockchainMinerPaneStatusBar';
import { BlockchainMinerIdleView } from './comps/IdleView/BlockchainMinerIdleView';
import { BlockchainMinerStoppedView } from './comps/StoppedView/BlockchainMinerStoppedView';
import { BlockchainMinerWorkingView } from './comps/WorkingView/BlockchainMinerWorkingView';

interface BlockchainMinerPaneProps {
  simulationUid: string;
  nodeUid: string;
}

export const BlockchainMinerPane: React.FC<BlockchainMinerPaneProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  const appData = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp
  );

  const getStateView = () => {
    const { currentState } = appData.miner;

    switch (currentState.state) {
      case 'idle':
        return <BlockchainMinerIdleView {...props} state={currentState} />;
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
