import { BlockchainKeyPair } from './BlockchainKeyPair';

export interface BlockchainWalletSnapshot {
  readonly keyPair: BlockchainKeyPair | null;
}
