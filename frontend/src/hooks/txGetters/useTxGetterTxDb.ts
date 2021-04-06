import { useTxGetter } from './useTxGetter';
import { TxGetter } from './TxGetter';

const txDbPlaces = ['mempool', 'tx-orphanage'] as const;

/** Returns a function that selects from redux the tx with given hash. Only looks in the `txDb`. */
export const useTxGetterTxDb = (args: {
  simulationUid: string;
  nodeUid: string;
}): TxGetter<typeof txDbPlaces> =>
  useTxGetter({
    ...args,
    searchIn: txDbPlaces,
  });
