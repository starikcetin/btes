import { TxGetPlace } from './TxGetPlace';
import { TxOutputGetResult } from './TxOutputGetResult';
import { BlockchainTxOutPoint } from '../../common/blockchain/tx/BlockchainTxOutPoint';

export type TxOutputGetter<TPlaces extends ReadonlyArray<TxGetPlace>> = (
  outpoint: BlockchainTxOutPoint
) => TxOutputGetResult<TPlaces> | null;
