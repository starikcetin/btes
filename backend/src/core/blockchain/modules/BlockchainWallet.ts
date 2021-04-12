import { BlockchainTx } from '../../../common/blockchain/tx/BlockchainTx';
import { BlockchainWalletSnapshot } from '../../../common/blockchain/snapshots/BlockchainWalletSnapshot';
import { BlockchainConfig } from '../../../common/blockchain/BlockchainConfig';
import { BlockchainKeyPair } from '../../../common/blockchain/crypto/BlockchainKeyPair';
import { hasValue } from '../../../common/utils/hasValue';
import { SimulationNamespaceEmitter } from '../../SimulationNamespaceEmitter';
import { BlockchainNetwork } from './BlockchainNetwork';
import { BlockchainTxDb } from './BlockchainTxDb';
import { BlockchainBlockDb } from './BlockchainBlockDb';
import { BlockchainTxInput } from '../../../common/blockchain/tx/BlockchainTxInput';

/**
 * Non-deterministic
 * https://github.com/bitcoinbook/bitcoinbook/blob/develop/ch05.asciidoc#nondeterministic-random-wallets
 */
export class BlockchainWallet {
  private readonly socketEmitter: SimulationNamespaceEmitter;
  private readonly network: BlockchainNetwork;
  private readonly txDb: BlockchainTxDb;
  private readonly blockDb: BlockchainBlockDb;
  private readonly nodeUid: string;
  private readonly config: BlockchainConfig;

  private _keyPair: BlockchainKeyPair | null;
  public get keyPair(): BlockchainKeyPair | null {
    return this._keyPair;
  }

  constructor(
    socketEmitter: SimulationNamespaceEmitter,
    network: BlockchainNetwork,
    txDb: BlockchainTxDb,
    blockDb: BlockchainBlockDb,
    nodeUid: string,
    config: BlockchainConfig,
    keyPair: BlockchainKeyPair | null
  ) {
    this.socketEmitter = socketEmitter;
    this.network = network;
    this.txDb = txDb;
    this.blockDb = blockDb;
    this.nodeUid = nodeUid;
    this.config = config;
    this._keyPair = keyPair;
  }

  public readonly takeSnapshot = (): BlockchainWalletSnapshot => {
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

  // Previously, I wanted to implement it such that the nodes accept their own txs without checks.
  // However, it proved difficult to implement and started to introduce many code duplications.
  // Therefore I decided to give that up and make nodes run their own txs through the same procedure
  // that foreign txs go through. Therefore, this method is now obsolete, but I am commenting it out
  // instead of removing it; in case we want to return back to this in the future.
  // ~~ Tarık, 2021-04-10 18:59
  //
  // /** Broadcasts the given transaction to connected peers. */
  // public readonly broadcastTx = (tx: BlockchainTx): void => {
  //   // add to self
  //   if (this.isTxOrphan(tx)) {
  //     this.txDb.addToOrphanage(tx);
  //   } else {
  //     this.txDb.addToMempool(tx);
  //   }
  //
  //   // broadcast to peers
  //   this.network.broadcastTx(tx);
  // };

  private readonly isTxOrphan = (tx: BlockchainTx): boolean => {
    return tx.inputs.some(this.isInputOrphan);
  };

  private readonly isInputOrphan = (input: BlockchainTxInput) => {
    return !(
      input.isCoinbase ||
      this.txDb.isTxInMempool(input.previousOutput.txHash) ||
      this.blockDb.isTxInMainBranch(input.previousOutput.txHash)
    );
  };
}
