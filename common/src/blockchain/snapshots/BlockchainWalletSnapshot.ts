import { BlockchainKeyPair } from '../crypto/BlockchainKeyPair';

export interface BlockchainWalletSnapshot {
  readonly keyPair: BlockchainKeyPair | null;
}
