import React from 'react';
import { useSelector } from 'react-redux';

import './BlockchainMinerPane.scss';
import { RootState } from '../../../state/RootState';

interface BlockchainMinerPaneProps {
  simulationUid: string;
  nodeUid: string;
}

export const BlockchainMinerPane: React.FC<BlockchainMinerPaneProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  const minerData = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.miner
  );

  return (
    <div className="comp-blockchain-miner-pane">
      Miner Pane {simulationUid} {nodeUid}
    </div>
  );
};
