import React from 'react';

import './BlockchainMinerWorkingView.scss';
import { BlockchainMinerWorkingState } from '../../../../../common/blockchain/miner/BlockchainMinerStateData';

export const BlockchainMinerWorkingView: React.FC<{
  state: BlockchainMinerWorkingState;
}> = (props) => {
  const { state } = props;

  return <div className="comp-blockchain-miner-working-view">Working View</div>;
};
