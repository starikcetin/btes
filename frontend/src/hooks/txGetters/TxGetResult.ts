import { BlockchainTx } from '../../common/blockchain/tx/BlockchainTx';
import { UnionOf } from '../../common/utils/UnionOf';
import { TxGetPlace } from './TxGetPlace';

export type TxGetResult<TPlaces extends ReadonlyArray<TxGetPlace>> = {
  place: UnionOf<TPlaces>;
  tx: BlockchainTx;
};
