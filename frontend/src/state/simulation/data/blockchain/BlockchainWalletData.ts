import { BlockchainKeyPair } from '../../../../common/blockchain/BlockchainKeyPair';

export interface BlockchainWalletData {
  readonly keyPair: BlockchainKeyPair | null;
}
