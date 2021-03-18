import { BlockchainKeyPair } from '../blockchain/crypto/BlockchainKeyPair';

export interface BlockchainKeyPairSavedPayload {
  readonly nodeUid: string;
  readonly keyPair: BlockchainKeyPair;
}
