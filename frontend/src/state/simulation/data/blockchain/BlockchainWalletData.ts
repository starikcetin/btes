import { BlockchainKeyPair } from '../../../../common/blockchain/crypto/BlockchainKeyPair';
import { BlockchainTxOutPoint } from '../../../../common/blockchain/tx/BlockchainTxOutPoint';

export interface BlockchainWalletData {
  readonly keyPair: BlockchainKeyPair | null;
  readonly ownUtxoSet: BlockchainTxOutPoint[];
}
