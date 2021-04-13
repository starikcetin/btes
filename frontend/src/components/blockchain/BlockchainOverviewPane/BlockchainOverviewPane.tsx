import React from 'react';
import { useSelector } from 'react-redux';
import { ListGroup } from 'react-bootstrap';

import './BlockchainOverviewPane.scss';
import { RootState } from '../../../state/RootState';
import { useFundsCalculator } from '../../../hooks/useFundsCalculator';
import { useTxOutputGetter } from '../../../hooks/txGetters/useTxOutputGetter';
import { useTxGetterEverywhere } from '../../../hooks/txGetters/useTxGetterEverywhere';

interface BlockchainOverviewPaneProps {
  simulationUid: string;
  nodeUid: string;
}

export const BlockchainOverviewPane: React.FC<BlockchainOverviewPaneProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;

  const txGetter = useTxGetterEverywhere({ simulationUid, nodeUid });
  const outputGetter = useTxOutputGetter(txGetter);
  const fundsCalculator = useFundsCalculator(outputGetter);

  const address = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.wallet
        .keyPair?.address
  );

  const utxoSet = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.wallet
        .ownUtxoSet
  );

  const orphanBlockCount = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.blockDb
        .orphanage.length
  );

  const mempoolSize = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.txDb
        .mempool.length
  );

  const orphanTxsCount = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.txDb
        .orphanage.length
  );

  const mainBranchHeadHash = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.blockDb
        .mainBranchHeadHash
  );

  const totalFunds = fundsCalculator(utxoSet);

  return (
    <div className="comp-blockchain-overview-pane">
      <ListGroup>
        <ListGroup.Item>
          Address: <code>{address ?? 'Not set'}</code>
        </ListGroup.Item>
        <ListGroup.Item>
          Total funds:{' '}
          <code>{Number.isNaN(totalFunds) ? '?' : totalFunds}</code>
        </ListGroup.Item>
        <ListGroup.Item>
          Main branch head: <code>{mainBranchHeadHash ?? 'None'}</code>
        </ListGroup.Item>
        <ListGroup.Item>
          Orphan blocks: <code>{orphanBlockCount}</code>
        </ListGroup.Item>
        <ListGroup.Item>
          Mempool size: <code>{mempoolSize}</code>
        </ListGroup.Item>
        <ListGroup.Item>
          Orphan transactions: <code>{orphanTxsCount}</code>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );
};
