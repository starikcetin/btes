import { BlockchainTx } from '../../../common/blockchain/BlockchainTx';
import { BlockchainWalletSnapshot } from '../../../common/blockchain/BlockchainWalletSnapshot';
import { BlockchainKeyPair } from '../BlockchainKeyPair';
import { BlockchainConfig } from '../../../common/blockchain/BlockchainConfig';

/**
 * Non-deterministic
 * https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch05.asciidoc#nondeterministic-random-wallets
 */
export class BlockchainWallet {
  private readonly config: BlockchainConfig;

  private readonly keyPairs: BlockchainKeyPair[] = [];

  constructor(config: BlockchainConfig) {
    this.config = config;
  }

  public readonly generateAndRecordKeyPair = (): BlockchainKeyPair => {
    const newKeyPair = new BlockchainKeyPair(this.config.keypairBitLength);
    this.keyPairs.push(newKeyPair);
    return newKeyPair;
  };

  public readonly takeSnapshot = (): BlockchainWalletSnapshot => {
    // TODO: implement
    return {};
  };

  public readonly addToWalletIfMine = (...txs: BlockchainTx[]): void => {
    /*
     * AddToWalletIfMine:
     *   bc16.4. & bc18.3.5. For each transaction, "Add to wallet if mine"
     */
    // TODO: implement
  };
}
