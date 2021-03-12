// TODO: how to handle the genesis block? ideally we should ask during simulation init and include it by default in all nodes.

import { NodeBlockchainAppSnapshot } from '../../common/blockchain/NodeBlockchainAppSnapshot';
import { BlockchainWallet } from './BlockchainWallet';
import { BlockchainTransactionDatabase } from './BlockchainTransactionDatabase';
import { BlockchainBlockDatabase } from './BlockchainBlockDatabase';

/** Deals with everything related to blockchain, for a specific node. */
export class NodeBlockchainApp {
  private readonly wallet: BlockchainWallet;
  private readonly transactionDatabase: BlockchainTransactionDatabase;
  private readonly blockDatabase: BlockchainBlockDatabase;

  constructor(
    wallet: BlockchainWallet,
    transactionDatabase: BlockchainTransactionDatabase,
    blockDatabase: BlockchainBlockDatabase
  ) {
    this.wallet = wallet;
    this.transactionDatabase = transactionDatabase;
    this.blockDatabase = blockDatabase;
  }

  public readonly takeSnapshot = (): NodeBlockchainAppSnapshot => {
    return {
      wallet: this.wallet.takeSnapshot(),
      transactionDatabase: this.transactionDatabase.takeSnapshot(),
      blockDatabase: this.blockDatabase.takeSnapshot(),
    };
  };
}
