import { BlockchainWalletSnapshot } from './BlockchainWalletSnapshot';
import { BlockchainTxDbSnapshot } from './BlockchainTxDbSnapshot';
import { BlockchainBlockDbSnapshot } from './BlockchainBlockDbSnapshot';
import { BlockchainConfig } from '../BlockchainConfig';
import { BlockchainMinerSnapshot } from './BlockchainMinerSnapshot';
import { BlockchainNetworkSnapshot } from './BlockchainNetworkSnapshot';

export interface NodeBlockchainAppSnapshot {
  readonly network: BlockchainNetworkSnapshot;
  readonly wallet: BlockchainWalletSnapshot;
  readonly miner: BlockchainMinerSnapshot;

  /** Transaction database */
  readonly txDb: BlockchainTxDbSnapshot;

  /** Block database */
  readonly blockDb: BlockchainBlockDbSnapshot;

  readonly config: BlockchainConfig;
}
