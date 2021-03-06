import { BlockchainWalletSnapshot } from './BlockchainWalletSnapshot';
import { BlockchainTransactionEngineSnapshot } from './BlockchainTransactionEngineSnapshot';
import { BlockchainBlockDatabaseSnapshot } from './BlockchainBlockDatabaseSnapshot';

export interface NodeBlockchainAppSnapshot {
  readonly wallet: BlockchainWalletSnapshot;
  readonly transactionEngine: BlockchainTransactionEngineSnapshot;
  readonly blockDatabase: BlockchainBlockDatabaseSnapshot;
}
