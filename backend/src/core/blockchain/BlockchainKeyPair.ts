import NodeRSA from 'node-rsa';

import { BlockchainKeyPairSnapshot } from '../../common/BlockchainKeyPairSnapshot';

export class BlockchainKeyPair {
  private readonly nodeRsa: NodeRSA;

  constructor(bitLength: number) {
    this.nodeRsa = new NodeRSA({ b: bitLength });
  }

  public readonly takeSnapshot = (): BlockchainKeyPairSnapshot => {
    // TODO: implement
    return {};
  };
}
