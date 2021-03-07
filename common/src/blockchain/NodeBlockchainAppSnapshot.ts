import { BlockchainWalletSnapshot } from './BlockchainWalletSnapshot';
import { BlockchainTransactionDatabaseSnapshot } from './BlockchainTransactionDatabaseSnapshot';
import { BlockchainBlockDatabaseSnapshot } from './BlockchainBlockDatabaseSnapshot';

export interface NodeBlockchainAppSnapshot {
  readonly wallet: BlockchainWalletSnapshot;
  readonly transactionDatabase: BlockchainTransactionDatabaseSnapshot;
  readonly blockDatabase: BlockchainBlockDatabaseSnapshot;
}
