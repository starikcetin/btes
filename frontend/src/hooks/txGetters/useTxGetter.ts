import { useCallback } from 'react';
import { useSelector } from 'react-redux';

import { hasValue } from '../../common/utils/hasValue';
import { RootState } from '../../state/RootState';
import { TxGetPlace } from './TxGetPlace';
import { TxGetter } from './TxGetter';

/** Returns a function that selects from redux the tx with given hash. */
export const useTxGetter = <TPlaces extends ReadonlyArray<TxGetPlace>>(args: {
  simulationUid: string;
  nodeUid: string;
  searchIn: TPlaces;
}): TxGetter<TPlaces> => {
  const { simulationUid, nodeUid, searchIn } = args;

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
      searchIn.includes('main-branch') && hasValue(mainBranchTxLookup[txHash])
        ? {
            place: 'main-branch',
            tx: mainBranchTxLookup[txHash],
          }
        : searchIn.includes('mempool') && hasValue(mempoolTxLookup[txHash])
        ? {
            place: 'mempool',
            tx: mempoolTxLookup[txHash],
          }
        : searchIn.includes('tx-orphanage') &&
          hasValue(txOrphanageTxLookup[txHash])
        ? {
            place: 'tx-orphanage',
            tx: txOrphanageTxLookup[txHash],
          }
        : searchIn.includes('block-orphanage') &&
          hasValue(blockOrphanageTxLookup[txHash])
        ? {
            place: 'block-orphanage',
            tx: blockOrphanageTxLookup[txHash],
          }
        : searchIn.includes('side-branch') &&
          hasValue(sideBranchesTxLookup[txHash])
        ? {
            place: 'side-branch',
            tx: sideBranchesTxLookup[txHash],
          }
        : null,
    [
      blockOrphanageTxLookup,
      mainBranchTxLookup,
      mempoolTxLookup,
      searchIn,
      sideBranchesTxLookup,
      txOrphanageTxLookup,
    ]
  );
};
