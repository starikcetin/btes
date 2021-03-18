import { BlockchainKeyPair } from '../../../../common/blockchain/crypto/BlockchainKeyPair';

export interface BlockchainWalletData {
  readonly keyPair: BlockchainKeyPair | null;
}
