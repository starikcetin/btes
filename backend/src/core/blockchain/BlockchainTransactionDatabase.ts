import _ from 'lodash';

import { BlockchainTransactionDatabaseSnapshot } from '../../common/blockchain/BlockchainTransactionDatabaseSnapshot';
import { BlockchainTransaction } from '../../common/blockchain/BlockchainTransaction';
import { BlockchainTransactionOutPoint } from '../../common/blockchain/BlockchainTransactionOutPoint';
import { areOutPointsEquivalent } from './utils/areOutPointsEquivalent';
import { hash } from '../../utils/hash';
import { removeFirst } from '../../common/utils/removeFirst';

// See BlockchainTransactionDatabaseSnapshot for member jsdocs.
export class BlockchainTransactionDatabase {
  private readonly mempool: BlockchainTransaction[];
  private readonly orphanage: BlockchainTransaction[];

  constructor(
    mempool: BlockchainTransaction[],
    orphanage: BlockchainTransaction[]
  ) {
    this.mempool = mempool;
    this.orphanage = orphanage;
  }

  public readonly takeSnapshot = (): BlockchainTransactionDatabaseSnapshot => {
    return {
      mempool: this.mempool,
      orphanage: this.orphanage,
    };
  };

  /** Is given outPoint used by any input of any tx in the mempool? */
  public readonly isOutPointInMempool = (
    outpoint: BlockchainTransactionOutPoint
  ): boolean => {
    return this.mempool.some((tx) =>
      tx.inputs.some((input) =>
        areOutPointsEquivalent(input.previousOutput, outpoint)
      )
    );
  };

  /** Does any tx in the mempool have the given hash? */
  public readonly isTxInMempool = (txHash: string): boolean => {
    return this.findTxInMempool(txHash) !== null;
  };

  /** Finds the tx in mempool that has the given hash. */
  public readonly findTxInMempool = (
    txHash: string
  ): BlockchainTransaction | null => {
    return this.mempool.find((tx) => hash(tx) === txHash) ?? null;
  };

  /** Removes the tx that has the given hash from the mempool and returns it. Null if not found. */
  public readonly removeFromMempool = (
    txHash: string
  ): BlockchainTransaction | null => {
    return removeFirst(this.mempool, (tx) => hash(tx) === txHash);
  };

  /** Adds the given tx to mempool unconditionally. Does nothing else. */
  public readonly addTxToMempool = (tx: BlockchainTransaction): void => {
    this.mempool.push(tx);
  };

  /** Adds the given tx to orphanage unconditionally. Does nothing else. */
  public readonly addToOrphanage = (tx: BlockchainTransaction): void => {
    this.orphanage.push(tx);
  };

  /**
   * Finds all orphan transactions referencing the given tx in one of its inputs.
   * Removes them from the orphanage and returns them.
   */
  public readonly popOrphansUsingTxAsInput = (
    txHash: string
  ): BlockchainTransaction[] =>
    _.remove(this.orphanage, (orphan) =>
      orphan.inputs.some((input) => input.previousOutput.txHash === txHash)
    );
}
