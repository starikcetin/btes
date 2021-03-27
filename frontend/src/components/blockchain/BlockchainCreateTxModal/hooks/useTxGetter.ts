import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { BlockchainTx } from '../../../../common/blockchain/tx/BlockchainTx';
import { hasValue } from '../../../../common/utils/hasValue';
import { RootState } from '../../../../state/RootState';

export type TxGetResult =
  | {
      place: 'nowhere';
    }
  | {
      place:
        | 'main-branch'
        | 'side-branch'
        | 'block-orphanage'
        | 'mempool'
        | 'tx-orphanage';
      tx: BlockchainTx;
    };

/** Returns a function that selects from redux the tx with given hash. */
export const useTxGetter = (args: {
  simulationUid: string;
  nodeUid: string;
}): ((txHash: string) => TxGetResult) => {
  const { simulationUid, nodeUid } = args;

  const mainBranchTxLookup = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.blockDb
        .mainBranchTxLookup
  );
  const sideBranchesTxLookup = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.blockDb
        .sideBranchesTxLookup
  );
  const blockOrphanageTxLookup = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.blockDb
        .orphanageTxLookup
  );
  const mempoolTxLookup = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.txDb
        .mempoolTxLookup
  );
  const txOrphanageTxLookup = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid].nodeMap[nodeUid].blockchainApp.txDb
        .orphanageTxLookup
  );

  return useCallback(
    (txHash: string) =>
      hasValue(mainBranchTxLookup[txHash])
        ? {
            place: 'main-branch',
            tx: mainBranchTxLookup[txHash],
          }
        : hasValue(mempoolTxLookup[txHash])
        ? {
            place: 'mempool',
            tx: mempoolTxLookup[txHash],
          }
        : hasValue(txOrphanageTxLookup[txHash])
        ? {
            place: 'tx-orphanage',
            tx: txOrphanageTxLookup[txHash],
          }
        : hasValue(blockOrphanageTxLookup[txHash])
        ? {
            place: 'block-orphanage',
            tx: blockOrphanageTxLookup[txHash],
          }
        : hasValue(sideBranchesTxLookup[txHash])
        ? {
            place: 'side-branch',
            tx: sideBranchesTxLookup[txHash],
          }
        : { place: 'nowhere' },
    [
      blockOrphanageTxLookup,
      mainBranchTxLookup,
      mempoolTxLookup,
      sideBranchesTxLookup,
      txOrphanageTxLookup,
    ]
  );
};
