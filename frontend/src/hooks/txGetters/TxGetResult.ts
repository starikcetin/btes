import { BlockchainTx } from '../../common/blockchain/tx/BlockchainTx';
import { ValueOf } from '../../common/utils/ValueOf';
import { TxGetPlace } from './TxGetPlace';

export type TxGetResult<TPlaces extends ReadonlyArray<TxGetPlace>> = {
  place: ValueOf<TPlaces>;
  tx: BlockchainTx;
};
