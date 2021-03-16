import { BlockchainKeyPair } from '../blockchain/BlockchainKeyPair';

export interface BlockchainSaveKeyPairPayload {
  readonly nodeUid: string;
  readonly keyPair: BlockchainKeyPair;
}
