import { BlockchainConfig } from '../../../../common/blockchain/BlockchainConfig';
import { BlockchainBlockDbData } from './BlockchainBlockDbData';
import { BlockchainMinerData } from './BlockchainMinerData';
import { BlockchainTxDbData } from './BlockchainTxDbData';
import { BlockchainWalletData } from './BlockchainWalletData';

export interface NodeBlockchainAppData {
  readonly blockDb: BlockchainBlockDbData;
  readonly txDb: BlockchainTxDbData;
  readonly wallet: BlockchainWalletData;
  readonly miner: BlockchainMinerData;
  readonly config: BlockchainConfig;
}
