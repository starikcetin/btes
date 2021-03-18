import { BlockchainKeyPair } from '../../../common/blockchain/crypto/BlockchainKeyPair';

export interface BlockchainKeyPairSavedActionPayload {
  readonly simulationUid: string;
  readonly nodeUid: string;
  readonly keyPair: BlockchainKeyPair;
}
