import { BlockchainBlock } from './BlockchainBlock';
import { BlockchainWalletSnapshot } from './BlockchainWalletSnapshot';

export interface NodeBlockchainAppSnapshot {
  readonly blockchainBlock: BlockchainBlock;
  readonly wallet: BlockchainWalletSnapshot;
}
