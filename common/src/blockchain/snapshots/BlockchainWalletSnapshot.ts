import { BlockchainKeyPair } from '../crypto/BlockchainKeyPair';
import { BlockchainTxOutPoint } from '../tx/BlockchainTxOutPoint';

export interface BlockchainWalletSnapshot {
  readonly ownUtxoSet: BlockchainTxOutPoint[];
  readonly keyPair: BlockchainKeyPair | null;
}
