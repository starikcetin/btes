import _ from 'lodash';

import { BlockchainTxDbSnapshot } from '../../../common/blockchain/snapshots/BlockchainTxDbSnapshot';
import { BlockchainTx } from '../../../common/blockchain/tx/BlockchainTx';
import { BlockchainTxOutPoint } from '../../../common/blockchain/tx/BlockchainTxOutPoint';
import { areOutPointsEqual } from '../utils/areOutPointsEqual';
import { removeFirst } from '../../../common/utils/removeFirst';
import { hashTx } from '../../../common/blockchain/utils/hashTx';
import { SimulationNamespaceEmitter } from '../../SimulationNamespaceEmitter';
import { hasValue } from '../../../common/utils/hasValue';

// See BlockchainTxDbSnapshot for member jsdocs.
export class BlockchainTxDb {
  private readonly socketEmitter: SimulationNamespaceEmitter;
  private readonly nodeUid: string;
  private readonly mempool: BlockchainTx[];
  private readonly orphanage: BlockchainTx[];

  constructor(
    socketEmitter: SimulationNamespaceEmitter,
    nodeUid: string,
    mempool: BlockchainTx[],
    orphanage: BlockchainTx[]
  ) {
    this.socketEmitter = socketEmitter;
    this.nodeUid = nodeUid;
    this.mempool = mempool;
    this.orphanage = orphanage;
  }

  public readonly takeSnapshot = (): BlockchainTxDbSnapshot => {
    return {
      mempool: this.mempool,
      orphanage: this.orphanage,
    };
  };

  /** Is given outPoint used by any input of any tx in the mempool? */
  public readonly isOutPointInMempool = (
    outpoint: BlockchainTxOutPoint
  ): boolean => {
    return this.mempool.some((tx) =>
      tx.inputs.some(
        (input) =>
          !input.isCoinbase && areOutPointsEqual(input.previousOutput, outpoint)
      )
    );
  };

  /** Does any tx in the mempool have the given hash? */
  public readonly isTxInMempool = (txHash: string): boolean => {
    return this.findTxInMempool(txHash) !== null;
  };

  /** Finds the tx in mempool that has the given hash. */
  public readonly findTxInMempool = (txHash: string): BlockchainTx | null => {
    return this.mempool.find((tx) => hashTx(tx) === txHash) ?? null;
  };

  /** Removes the tx that has the given hash from the mempool and returns it. Null if not found. */
  public readonly removeFromMempool = (txHash: string): BlockchainTx | null => {
    const removed = removeFirst(this.mempool, (tx) => hashTx(tx) === txHash);

    if (hasValue(removed)) {
      this.socketEmitter.sendTxRemovedFromMempool({
        nodeUid: this.nodeUid,
        removedTxHash: hashTx(removed),
      });
    }

    return removed;
  };

  /** Adds the given tx to mempool unconditionally. Does nothing else. */
  public readonly addToMempool = (tx: BlockchainTx): void => {
    this.mempool.push(tx);

    this.socketEmitter.sendTxAddedToMempool({
      nodeUid: this.nodeUid,
      tx,
    });
  };

  /** Adds the given tx to orphanage unconditionally. Does nothing else. */
  public readonly addToOrphanage = (tx: BlockchainTx): void => {
    this.orphanage.push(tx);

    this.socketEmitter.sendTxAddedToOrphanage({
      nodeUid: this.nodeUid,
      tx,
    });
  };

  /**
   * Finds all orphan transactions referencing the given tx in one of its inputs.
   * Removes them from the orphanage and returns them.
   */
  public readonly popOrphansWithTxAsInput = (
    txHash: string
  ): BlockchainTx[] => {
    const poppedOrphans = _.remove(this.orphanage, (orphan) =>
      orphan.inputs.some(
        (input) => !input.isCoinbase && input.previousOutput.txHash === txHash
      )
    );

    if (poppedOrphans.length > 0) {
      this.socketEmitter.sendTxsRemovedFromOrphanage({
        nodeUid: this.nodeUid,
        removedTxHashes: poppedOrphans.map(hashTx),
      });
    }

    return poppedOrphans;
  };
}
