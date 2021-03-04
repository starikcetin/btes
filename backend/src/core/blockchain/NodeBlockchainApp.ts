import { BlockchainBlock } from '../../common/BlockchainBlock';
import { NodeBlockchainAppSnapshot } from '../../common/NodeBlockchainAppSnapshot';
import { BlockchainWallet } from './BlockchainWallet';

/** Deals with everything related to blockchain, for a specific node. */
export class NodeBlockchainApp {
  private readonly blockchainBlock: BlockchainBlock;
  private readonly wallet: BlockchainWallet;

  constructor(blockchainBlock: BlockchainBlock, wallet: BlockchainWallet) {
    this.blockchainBlock = blockchainBlock;
    this.wallet = wallet;
  }

  public readonly takeSnapshot = (): NodeBlockchainAppSnapshot => {
    return {
      blockchainBlock: this.blockchainBlock,
      wallet: this.wallet.takeSnapshot(),
    };
  };
}
