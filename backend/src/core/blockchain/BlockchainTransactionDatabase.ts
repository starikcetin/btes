import { BlockchainTransactionDatabaseSnapshot } from '../../common/blockchain/BlockchainTransactionDatabaseSnapshot';
import { BlockchainTransaction } from '../../common/blockchain/BlockchainTransaction';

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
}
