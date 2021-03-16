import { BlockchainWalletSnapshot } from './BlockchainWalletSnapshot';
import { BlockchainTxDbSnapshot } from './BlockchainTxDbSnapshot';
import { BlockchainBlockDbSnapshot } from './BlockchainBlockDbSnapshot';
import { BlockchainConfig } from '../BlockchainConfig';
import { BlockchainMinerSnapshot } from './BlockchainMinerSnapshot';

export interface NodeBlockchainAppSnapshot {
  readonly wallet: BlockchainWalletSnapshot;
  readonly miner: BlockchainMinerSnapshot;

  /** Transaction database */
  readonly txDb: BlockchainTxDbSnapshot;

  /** Block database */
  readonly blockDb: BlockchainBlockDbSnapshot;

  readonly config: BlockchainConfig;
}
