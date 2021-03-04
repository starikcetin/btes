import { BlockchainWalletSnapshot } from '../../common/BlockchainWalletSnapshot';
import { BlockchainKeyPair } from './BlockchainKeyPair';

/**
 * Non-deterministic
 * https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch05.asciidoc#nondeterministic-random-wallets
 */
export class BlockchainWallet {
  public readonly keyPairBitLength: number;

  private readonly keyPairs: BlockchainKeyPair[] = [];

  constructor(keyPairBitLength: number) {
    this.keyPairBitLength = keyPairBitLength;
  }

  public readonly generateAndRecordKeyPair = (): BlockchainKeyPair => {
    const newKeyPair = new BlockchainKeyPair(this.keyPairBitLength);
    this.keyPairs.push(newKeyPair);
    return newKeyPair;
  };

  public readonly takeSnapshot = (): BlockchainWalletSnapshot => {
    // TODO: implement
    return {};
  };
}
