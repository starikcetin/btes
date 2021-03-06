import { BlockchainTransactionEngineSnapshot } from '../../common/blockchain/BlockchainTransactionEngineSnapshot';
import { BlockchainTransaction } from '../../common/blockchain/BlockchainTransaction';

// See BlockchainTransactionEngineSnapshot for member jsdocs.

export class BlockchainTransactionEngine {
  private readonly transactionPool: BlockchainTransaction[];
  private readonly orphanTransactionsPool: BlockchainTransaction[];

  constructor(
    transactionPool: BlockchainTransaction[],
    orphanTransactionsPool: BlockchainTransaction[]
  ) {
    this.transactionPool = transactionPool;
    this.orphanTransactionsPool = orphanTransactionsPool;
  }

  public readonly takeSnapshot = (): BlockchainTransactionEngineSnapshot => {
    return {
      transactionPool: this.transactionPool,
      orphanTransactionsPool: this.orphanTransactionsPool,
    };
  };
}
