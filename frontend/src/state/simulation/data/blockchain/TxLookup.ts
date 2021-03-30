import { BlockchainTx } from '../../../../common/blockchain/tx/BlockchainTx';

export interface TxLookup {
  [hash: string]: BlockchainTx;
}
