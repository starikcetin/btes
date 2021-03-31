import { BlockchainTxOutput } from '../../common/blockchain/tx/BlockchainTxOutput';
import { TxGetPlace } from './TxGetPlace';
import { TxGetResult } from './TxGetResult';

export type TxOutputGetResult<
  TPlaces extends ReadonlyArray<TxGetPlace>
> = TxGetResult<TPlaces> & { output: BlockchainTxOutput | null };
