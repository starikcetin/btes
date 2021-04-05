import { TxGetPlace } from './TxGetPlace';
import { TxGetResult } from './TxGetResult';

export type TxGetter<TPlaces extends ReadonlyArray<TxGetPlace>> = (
  txHash: string
) => TxGetResult<TPlaces> | null;
