import { BlockchainKeyPair } from '../blockchain/crypto/BlockchainKeyPair';

export interface BlockchainSaveKeyPairPayload {
  readonly nodeUid: string;
  readonly keyPair: BlockchainKeyPair;
}
