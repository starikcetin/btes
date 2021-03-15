import { BlockchainWalletSnapshot } from './BlockchainWalletSnapshot';
import { BlockchainTxDbSnapshot } from './BlockchainTxDbSnapshot';
import { BlockchainBlockDbSnapshot } from './BlockchainBlockDbSnapshot';
import { BlockchainConfig } from './BlockchainConfig';

export interface NodeBlockchainAppSnapshot {
  readonly wallet: BlockchainWalletSnapshot;

  /** Transaction database */
  readonly txDb: BlockchainTxDbSnapshot;

  /** Block database */
  readonly blockDb: BlockchainBlockDbSnapshot;

  readonly config: BlockchainConfig;
}
