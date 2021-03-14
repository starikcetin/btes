import { BlockchainWalletSnapshot } from './BlockchainWalletSnapshot';
import { BlockchainTransactionDatabaseSnapshot } from './BlockchainTransactionDatabaseSnapshot';
import { BlockchainBlockDatabaseSnapshot } from './BlockchainBlockDatabaseSnapshot';
import { BlockchainConfig } from './BlockchainConfig';

export interface NodeBlockchainAppSnapshot {
  readonly wallet: BlockchainWalletSnapshot;
  readonly transactionDatabase: BlockchainTransactionDatabaseSnapshot;
  readonly blockDatabase: BlockchainBlockDatabaseSnapshot;
  readonly config: BlockchainConfig;
}
