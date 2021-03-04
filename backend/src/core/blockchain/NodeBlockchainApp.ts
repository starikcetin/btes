import { BlockchainBlock } from '../../common/BlockchainBlock';
import { NodeBlockchainAppSnapshot } from '../../common/NodeBlockchainAppSnapshot';
import { BlockchainWallet } from './BlockchainWallet';
import { BlockchainTransactionEngine } from './BlockchainTransactionEngine';

/** Deals with everything related to blockchain, for a specific node. */
export class NodeBlockchainApp {
  private readonly blockchainBlock: BlockchainBlock;
  private readonly wallet: BlockchainWallet;
  private readonly transactionEngine: BlockchainTransactionEngine;

  constructor(
    blockchainBlock: BlockchainBlock,
    wallet: BlockchainWallet,
    transactionEngine: BlockchainTransactionEngine
  ) {
    this.blockchainBlock = blockchainBlock;
    this.wallet = wallet;
    this.transactionEngine = transactionEngine;
  }

  public readonly takeSnapshot = (): NodeBlockchainAppSnapshot => {
    return {
      blockchainBlock: this.blockchainBlock,
      wallet: this.wallet.takeSnapshot(),
      transactionEngine: this.transactionEngine.takeSnapshot(),
    };
  };
}
