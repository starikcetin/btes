import { BlockchainTx } from '../../../common/blockchain/BlockchainTx';
import { BlockchainWalletSnapshot } from '../../../common/blockchain/BlockchainWalletSnapshot';
import { BlockchainConfig } from '../../../common/blockchain/BlockchainConfig';
import { BlockchainKeyPair } from '../../../common/blockchain/BlockchainKeyPair';
import { hasValue } from '../../../common/utils/hasValue';
import { SimulationNamespaceEmitter } from '../../SimulationNamespaceEmitter';

/**
 * Non-deterministic
 * https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch05.asciidoc#nondeterministic-random-wallets
 */
export class BlockchainWallet {
  private readonly socketEmitter: SimulationNamespaceEmitter;
  private readonly nodeUid: string;
  private readonly config: BlockchainConfig;

  private _keyPair: BlockchainKeyPair | null;
  public get keyPair(): BlockchainKeyPair | null {
    return this._keyPair;
  }

  constructor(
    socketEmitter: SimulationNamespaceEmitter,
    nodeUid: string,
    config: BlockchainConfig,
    keyPair: BlockchainKeyPair | null
  ) {
    this.socketEmitter = socketEmitter;
    this.nodeUid = nodeUid;
    this.config = config;
    this._keyPair = keyPair;
  }

  public readonly takeSnapshot = (): BlockchainWalletSnapshot => {
    // TODO: implement
    return {
      keyPair: this._keyPair,
    };
  };

  public readonly addToWalletIfMine = (...txs: BlockchainTx[]): void => {
    /*
     * AddToWalletIfMine:
     *   bc16.4. & bc18.3.5. For each transaction, "Add to wallet if mine"
     */
    // TODO: implement
  };

  /** Saves the given key pair if we don't already have one. */
  public readonly saveKeyPair = (keyPair: BlockchainKeyPair): void => {
    if (!hasValue(this._keyPair)) {
      this._keyPair = keyPair;
    }

    this.socketEmitter.sendBlockchainKeyPairSaved({
      nodeUid: this.nodeUid,
      keyPair: this._keyPair,
    });
  };
}
