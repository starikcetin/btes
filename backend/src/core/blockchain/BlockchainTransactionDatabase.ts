import { BlockchainTransactionDatabaseSnapshot } from '../../common/blockchain/BlockchainTransactionDatabaseSnapshot';
import { BlockchainTransaction } from '../../common/blockchain/BlockchainTransaction';
import { BlockchainTransactionOutPoint } from '../../common/blockchain/BlockchainTransactionOutPoint';
import { areOutPointsEquivalent } from './utils/areOutPointsEquivalent';
import { hash } from '../../utils/hash';

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
}
