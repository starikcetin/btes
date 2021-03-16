import _ from 'lodash';

import { BlockchainTxDbSnapshot } from '../../../common/blockchain/BlockchainTxDbSnapshot';
import {
  BlockchainRegularTx,
  BlockchainTx,
} from '../../../common/blockchain/BlockchainTx';
import { BlockchainTxOutPoint } from '../../../common/blockchain/BlockchainTxOutPoint';
import { areOutPointsEqual } from '../utils/areOutPointsEqual';
import { removeFirst } from '../../../common/utils/removeFirst';
import { hashTx } from '../../../common/blockchain/utils/hashTx';

// See BlockchainTxDbSnapshot for member jsdocs.
export class BlockchainTxDb {
  private readonly mempool: BlockchainRegularTx[];
  private readonly orphanage: BlockchainRegularTx[];

  constructor(
    mempool: BlockchainRegularTx[],
    orphanage: BlockchainRegularTx[]
  ) {
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
      tx.inputs.some((input) =>
        areOutPointsEqual(input.previousOutput, outpoint)
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
    return removeFirst(this.mempool, (tx) => hashTx(tx) === txHash);
  };

  /** Adds the given tx to mempool unconditionally. Does nothing else. */
  public readonly addToMempool = (tx: BlockchainRegularTx): void => {
    this.mempool.push(tx);
  };

  /** Adds the given tx to orphanage unconditionally. Does nothing else. */
  public readonly addToOrphanage = (tx: BlockchainRegularTx): void => {
    this.orphanage.push(tx);
  };

  /**
   * Finds all orphan transactions referencing the given tx in one of its inputs.
   * Removes them from the orphanage and returns them.
   */
  public readonly popOrphansWithTxAsInput = (
    txHash: string
  ): BlockchainRegularTx[] =>
    _.remove(this.orphanage, (orphan) =>
      orphan.inputs.some((input) => input.previousOutput.txHash === txHash)
    );
}
