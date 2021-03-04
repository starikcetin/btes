import { BlockchainBlock } from './BlockchainBlock';
import { BlockchainWalletSnapshot } from './BlockchainWalletSnapshot';
import { BlockchainTransactionEngineSnapshot } from './BlockchainTransactionEngineSnapshot';

export interface NodeBlockchainAppSnapshot {
  readonly blockchainBlock: BlockchainBlock;
  readonly wallet: BlockchainWalletSnapshot;
  readonly transactionEngine: BlockchainTransactionEngineSnapshot;
}
