import { BlockchainBlockDatabaseSnapshot } from '../../common/blockchain/BlockchainBlockDatabaseSnapshot';
import { BlockchainBlock } from '../../common/blockchain/BlockchainBlock';

export class BlockchainBlockDatabase {
  private readonly blocks: BlockchainBlock[];

  constructor(blocks: BlockchainBlock[]) {
    this.blocks = blocks;
  }

  public readonly takeSnapshot = (): BlockchainBlockDatabaseSnapshot => {
    return {
      blocks: this.blocks,
    };
  };
}
