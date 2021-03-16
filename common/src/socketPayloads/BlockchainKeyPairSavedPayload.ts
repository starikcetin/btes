import { BlockchainKeyPair } from '../blockchain/BlockchainKeyPair';

export interface BlockchainKeyPairSavedPayload {
  readonly nodeUid: string;
  readonly keyPair: BlockchainKeyPair;
}
