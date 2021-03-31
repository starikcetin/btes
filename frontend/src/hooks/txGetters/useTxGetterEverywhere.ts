import { useTxGetter } from './useTxGetter';
import { TxGetter } from './TxGetter';

const allPlaces = [
  'main-branch',
  'side-branch',
  'block-orphanage',
  'mempool',
  'tx-orphanage',
] as const;

/** Returns a function that selects from redux the tx with given hash. Looks everywhere. */
export const useTxGetterEverywhere = (args: {
  simulationUid: string;
  nodeUid: string;
}): TxGetter<typeof allPlaces> =>
  useTxGetter({
    ...args,
    searchIn: allPlaces,
  });
