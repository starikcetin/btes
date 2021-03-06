import { NodeBlockchainAppSnapshot } from '../../common/blockchain/NodeBlockchainAppSnapshot';
import { BlockchainWallet } from './BlockchainWallet';
import { BlockchainTransactionEngine } from './BlockchainTransactionEngine';
import { BlockchainBlockDatabase } from './BlockchainBlockDatabase';

/** Deals with everything related to blockchain, for a specific node. */
export class NodeBlockchainApp {
  private readonly wallet: BlockchainWallet;
  private readonly transactionEngine: BlockchainTransactionEngine;
  private readonly blockDatabase: BlockchainBlockDatabase;

  constructor(
    wallet: BlockchainWallet,
    transactionEngine: BlockchainTransactionEngine,
    blockDatabase: BlockchainBlockDatabase
  ) {
    this.wallet = wallet;
    this.transactionEngine = transactionEngine;
    this.blockDatabase = blockDatabase;
  }

  public readonly takeSnapshot = (): NodeBlockchainAppSnapshot => {
    return {
      wallet: this.wallet.takeSnapshot(),
      transactionEngine: this.transactionEngine.takeSnapshot(),
      blockDatabase: this.blockDatabase.takeSnapshot(),
    };
  };
}
