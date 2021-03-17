import React from 'react';

import './BlockchainMinerStoppedView.scss';
import { BlockchainMinerStoppedState } from '../../../../../common/blockchain/miner/BlockchainMinerStateData';

export const BlockchainMinerStoppedView: React.FC<{
  state: BlockchainMinerStoppedState;
}> = (props) => {
  const { state } = props;

  return <div className="comp-blockchain-miner-stopped-view">Stopped View</div>;
};
