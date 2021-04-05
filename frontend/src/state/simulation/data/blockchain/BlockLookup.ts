import { BlockchainBlock } from '../../../../common/blockchain/block/BlockchainBlock';

export interface BlockLookup {
  [hash: string]: BlockchainBlock | undefined;
}
