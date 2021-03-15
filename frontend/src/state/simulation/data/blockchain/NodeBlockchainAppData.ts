import { BlockchainBlockDbData } from './BlockchainBlockDbData';
import { BlockchainTxDbData } from './BlockchainTxDbData';

export interface NodeBlockchainAppData {
  readonly blockDb: BlockchainBlockDbData;
  readonly txDb: BlockchainTxDbData;
}
