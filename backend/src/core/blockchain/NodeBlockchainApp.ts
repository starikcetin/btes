// TODO: how to handle the genesis block? ideally we should ask during simulation init and include it by default in all nodes.

import { NodeBlockchainAppSnapshot } from '../../common/blockchain/NodeBlockchainAppSnapshot';
import { BlockchainWallet } from './BlockchainWallet';
import { BlockchainTransactionDatabase } from './BlockchainTransactionDatabase';
import { BlockchainBlockDatabase } from './BlockchainBlockDatabase';
import { BlockchainConfig } from '../../common/blockchain/BlockchainConfig';
import { BlockchainBlock } from '../../common/blockchain/BlockchainBlock';
import { BlockchainTransaction } from '../../common/blockchain/BlockchainTransaction';
import { hash } from '../../utils/hash';
import { BlockchainBlockChecker } from './validation/BlockchainBlockChecker';
import { BlockchainTxChecker } from './validation/BlockchainTxChecker';
import { BlockchainCommonChecker } from './validation/BlockchainCommonChecker';

/** Deals with everything related to blockchain, for a specific node. */
export class NodeBlockchainApp {
  private readonly wallet: BlockchainWallet;
  private readonly transactionDatabase: BlockchainTransactionDatabase;
  private readonly blockDatabase: BlockchainBlockDatabase;
  private readonly config: BlockchainConfig;
  private readonly blockChecker: BlockchainBlockChecker;
  private readonly txChecker: BlockchainTxChecker;

  constructor(
    wallet: BlockchainWallet,
    transactionDatabase: BlockchainTransactionDatabase,
    blockDatabase: BlockchainBlockDatabase,
    config: BlockchainConfig
  ) {
    this.wallet = wallet;
    this.transactionDatabase = transactionDatabase;
    this.blockDatabase = blockDatabase;
    this.config = config;

    const commonChecker = new BlockchainCommonChecker(
      config,
      blockDatabase,
      transactionDatabase
    );
    this.txChecker = new BlockchainTxChecker(commonChecker);
    this.blockChecker = new BlockchainBlockChecker(
      config,
      blockDatabase,
      transactionDatabase,
      wallet,
      commonChecker
    );
  }

  public readonly takeSnapshot = (): NodeBlockchainAppSnapshot => {
    return {
      wallet: this.wallet.takeSnapshot(),
      transactionDatabase: this.transactionDatabase.takeSnapshot(),
      blockDatabase: this.blockDatabase.takeSnapshot(),
      config: this.config,
    };
  };

  public readonly receiveBlock = (block: BlockchainBlock): void => {
    // CheckBlockForReceiveBlock
    const cbfrb = this.blockChecker.checkBlockForReceiveBlock(block);

    // if orphan:
    if (cbfrb.validity === 'orphan') {
      // bc11... add this to orphan blocks...
      this.blockDatabase.addToOrphanage(block);

      // TODO: bc11... then query peer we got this from for 1st missing orphan block in prev chain...

      // bc11... done with block
      return;
    }

    // if valid:
    if (cbfrb.validity === 'valid') {
      // AddBlock
      const { isValid, canRelay } = this.blockChecker.addBlock(
        block,
        cbfrb.parentNode
      );

      // if did not reject:
      if (isValid) {
        // if relay:
        if (canRelay) {
          // TODO: bc16.6. & bc18.7. Relay block to our peers
        }

        // bc19. For each orphan block for which this block is its prev, run all these steps (including this one) recursively on that orphan
        const blockHash = hash(block.header);
        this.blockDatabase
          .popOrphansWithParent(blockHash)
          .forEach(this.receiveBlock);
      }
    }
  };

  public readonly receiveTx = (tx: BlockchainTransaction): void => {
    // CheckTxForReceiveTx
    const checkResult = this.txChecker.checkTxForReceiveTx(tx);

    // if orphan:
    if (checkResult === 'orphan') {
      // tx10... Add to the orphan transactions, if a matching transaction is not in there already.
      this.transactionDatabase.addToOrphanage(tx);
    }

    // if valid:
    if (checkResult === 'valid') {
      // tx17. Add to transaction pool[7]
      this.transactionDatabase.addTxToMempool(tx);

      // tx18. "Add to wallet if mine"
      this.wallet.addToWalletIfMine(tx);

      // TODO: tx19. Relay transaction to peers

      // tx20. For each orphan transaction that uses this one as one of its inputs, run all these steps (including this one) recursively on that orphan
      const txHash = hash(tx);
      this.transactionDatabase
        .popOrphansUsingTxAsInput(txHash)
        .forEach(this.receiveTx);
    }
  };
}
