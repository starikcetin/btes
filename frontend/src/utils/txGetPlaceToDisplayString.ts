import { TxGetPlace } from '../hooks/txGetters/TxGetPlace';

export const txGetPlaceToDisplayString = (place: TxGetPlace): string => {
  switch (place) {
    case 'main-branch':
      return 'On the main branch.';
    case 'side-branch':
      return 'On a side branch.';
    case 'block-orphanage':
      return 'In an orphan block';
    case 'mempool':
      return 'In the mempool.';
    case 'tx-orphanage':
      return 'In an orphan transaction.';
    default:
      throw new Error(`Unknown value for place: ${place}`);
  }
};
