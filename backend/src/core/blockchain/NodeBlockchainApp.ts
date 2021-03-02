import { BlockchainBlock } from '../../common/BlockchainBlock';
import { NodeBlockchainAppSnapshot } from '../../common/NodeBlockchainAppSnapshot';

/** Deals with everything related to blockchain, for a specific node. */
export class NodeBlockchainApp {
  private readonly blockchainBlock: BlockchainBlock;

  constructor(blockchainBlock: BlockchainBlock) {
    this.blockchainBlock = blockchainBlock;
  }

  public readonly takeSnapshot = (): NodeBlockchainAppSnapshot => {
    return {
      blockchainBlock: this.blockchainBlock,
    };
  };
}
