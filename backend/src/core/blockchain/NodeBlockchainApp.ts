// TODO: how to handle the genesis block? ideally we should ask during simulation init and include it by default in all nodes.

import { NodeBlockchainAppSnapshot } from '../../common/blockchain/NodeBlockchainAppSnapshot';
import { BlockchainWallet } from './BlockchainWallet';
import { BlockchainTransactionDatabase } from './BlockchainTransactionDatabase';
import { BlockchainBlockDatabase } from './BlockchainBlockDatabase';
import { BlockchainTransaction } from '../../common/blockchain/BlockchainTransaction';
import { hash } from '../../utils/hash';

/** Deals with everything related to blockchain, for a specific node. */
export class NodeBlockchainApp {
  private readonly wallet: BlockchainWallet;
  private readonly transactionDatabase: BlockchainTransactionDatabase;
  private readonly blockDatabase: BlockchainBlockDatabase;

  constructor(
    wallet: BlockchainWallet,
    transactionDatabase: BlockchainTransactionDatabase,
    blockDatabase: BlockchainBlockDatabase,
    blockCreationFee: number,
    coinbaseMaturity: number
  ) {
    this.wallet = wallet;
    this.transactionDatabase = transactionDatabase;
    this.blockDatabase = blockDatabase;
    this.blockCreationFee = blockCreationFee;
    this.coinbaseMaturity = coinbaseMaturity;
  }

  public readonly takeSnapshot = (): NodeBlockchainAppSnapshot => {
    return {
      wallet: this.wallet.takeSnapshot(),
      transactionDatabase: this.transactionDatabase.takeSnapshot(),
      blockDatabase: this.blockDatabase.takeSnapshot(),
    };
  };

  //
  // ---- Config ----
  //

  /** Aka block reward. In satoshis. */
  private readonly blockCreationFee: number;

  /** Number of confirmations needed to be able to spend a coinbase output. */
  private readonly coinbaseMaturity: number;

  //
  // ---- Tx ----
  //

  public readonly receiveTx = () => {
    /*
     * ReceiveTx:
     *   CheckTxForReceiveTx
     *   if orphan:
     *     tx10... Add to the orphan transactions, if a matching transaction is not in there already.
     *   if valid:
     *     tx17. Add to transaction pool[7]
     *     tx18. "Add to wallet if mine"
     *     tx19. Relay transaction to peers
     *     tx20. For each orphan transaction that uses this one as one of its inputs, run all these steps (including this one) recursively on that orphan
     */
  };

  private readonly checkTxForReceiveTx = () => {
    /*
     * CheckTxForReceiveTx:
     *   CheckTxContextFree (canSearchMainBranchForDupes = true)
     *   CheckTxForReceive (canSearchMempoolForOutput = true, checkForOutputIndex = false)
     *
     */
  };

  //
  // ---- Block ----
  //

  public readonly receiveBlock = () => {
    /*
     * ReceiveBlock:
     *   CheckBlockForReceiveBlock
     *   if orphan:
     *     bc11... add this to orphan blocks, then query peer we got this from for 1st missing orphan block in prev chain; done with block
     *   if valid:
     *     AddBlock
     *     if did not reject:
     *       if relay:
     *         bc16.6. & bc18.7. Relay block to our peers
     *       bc19. For each orphan block for which this block is its prev, run all these steps (including this one) recursively on that orphan
     */
  };

  private readonly checkBlockForReceiveBlock = () => {
    /*
     * CheckBlockForReceiveBlock:
     *   invalid bc2. Reject if duplicate of block we have in any of the three categories (main, side, orphan)
     *   <<<<<<< CheckBlockContextFree
     *   invalid bc12. Check that nBits value matches the difficulty rules
     */
  };

  private readonly checkBlockContextFree = () => {
    /*
     * CheckBlockContextFree:
     *   invalid bc3. Transaction list must be non-empty
     *   invalid bc4. Block hash must satisfy claimed nBits proof of work
     *   invalid bc6. First transaction must be coinbase, the rest must not be
     *   invalid bc7. For each transaction, apply "tx" checks 2-4
     *   orphan  bc11. Check if prev block (matching prev hash) is in main branch or side branches If not, ...
     */
  };

  private readonly addBlock = () => {
    /*
     * AddBlock:
     *              GetBlockAddType
     *              if side-extend:
     *   (no-relay)   bc17... we don't do anything.
     *              if main-extend:
     *   (relay)      AddBlockMainExtend
     *              if promote:
     *   (relay)      AddBlockPromote
     *              if did not reject:
     *                Add block to tree
     */
  };

  private readonly getBlockAddType = () => {
    /*
     * GetBlockAddType:
     *               bc15. Add block into the tree. There are three cases: (we do not actually add here, poor writing)
     *   main-extend bc16. For case 1, adding to main branch:
     *   side-extend bc17. For case 2, adding to a side branch...
     *   promote     bc18. For case 3, a side branch becoming the main branch:
     */
  };

  private readonly addBlockMainExtend = () => {
    /*
     * AddBlockMainExtend:
     *   CheckTxsForReceiveBlock
     *   bc16.3. (If we have not rejected):
     *     AddToWalletIfMine
     *     CleanupMempool
     *   bc16.7. If we rejected, the block is not counted as part of the main branch
     */
  };

  private readonly addBlockPromote = () => {
    /*
     * AddBlockPromote:
     *   bc18.1. Find the fork block on the main branch which this side branch forks off of
     *   bc18.2. Redefine the main branch to only go up to this fork block
     *   bc18.3. For each block on the side branch, from the child of the fork block to the leaf, add to the main branch: (DON'T FORGET: run these steps for the to-be-added block also!)
     *     CheckBlockContextFree (bc18.3.1. Do "branch" checks 3-11) (result can never be orphan, because it was in the chain already)
     *     CheckTxsForReceiveBlock
     *     bc18.3.4. (If we have not rejected):
     *       AddToWalletIfMine
     *   bc18.4. If we reject at any point, leave the main branch as what it was originally, done with block
     *   bc18.5. For each block in the old main branch, from the leaf down to the child of the fork block:
     *     ReclaimTxsToMempool
     *   bc18.6. For each block in the new main branch, from the child of the fork node to the leaf:
     *      CleanupMempool
     */
  };

  private readonly reclaimTxsToMempool = () => {
    /*
     * ReclaimTxsToMempool:
     *   bc18.5.1. For each non-coinbase transaction in the block:
     *     CheckTxContextFree (canSearchMainBranchForDupes = false) (bc18.5.1.1. Apply "tx" checks 2-9, except in step 8, only look in the transaction pool for duplicates, not the main branch)
     *     bc18.5.1.2. Add to transaction pool if accepted, else go on to next transaction
     */
  };

  private readonly addToWalletIfMine = () => {
    /*
     * AddToWalletIfMine:
     *   bc16.4. & bc18.3.5. For each transaction, "Add to wallet if mine"
     */
  };

  private readonly cleanupMempool = () => {
    /*
     * CleanupMempool:
     *   bc16.5. & bc18.6.1. For each transaction in the block, delete any matching transaction from the transaction pool
     */
  };

  private readonly checkTxsForReceiveBlock = () => {
    /*
     * CheckTxsForReceiveBlock:
     *           bc16.1. For all but the coinbase transaction, apply the following:
     *   <<<<<<<   CheckTxForReceive (canSearchMempoolForOutput = false, checkForOutputIndex = true) (reject if orphan)
     *   invalid bc16.2. Reject if coinbase value > sum of block creation fee and transaction fees
     */
  };

  //
  // ---- Common ----
  //

  private readonly checkTxForReceive = () => {
    /*
     * CheckTxForReceive (canSearchMempoolForOutput, checkForOutputIndex):
     *   orphan  tx10. & bc16.1.1. For each input, look in the main branch (if canSearchMempoolForOutput: also look in the transaction pool) to find the referenced output transaction. If the output transaction is missing for any input, this will be an orphan transaction...
     *           if checkForOutputIndex:
     *   invalid   bc16.1.2. For each input, if we are using the nth output of the earlier transaction, but it has fewer than n+1 outputs, reject.
     *   invalid tx11. & bc16.1.3. For each input, if the referenced output transaction is coinbase, it must have at least COINBASE_MATURITY confirmations; else reject this transaction
     *   invalid tx12. & bc16.1.5. For each input, if the referenced output does not exist (e.g. never existed or has already been spent), reject this transaction[6]
     *   invalid tx14. & bc16.1.7. Reject if the sum of input values < sum of output values
     *   invalid tx16. & bc16.1.4. Verify the scriptPubKey accepts for each input; reject if any are bad
     */
  };

  private readonly checkTxContextFree = (
    tx: BlockchainTransaction,
    canSearchMainBranchForDupes: boolean
  ): 'invalid' | 'valid' => {
    const txHash = hash(tx);

    // tx2. Make sure neither in or out lists are empty
    if (tx.inputs.length === 0 || tx.outputs.length === 0) {
      return 'invalid';
    }

    // tx5. Make sure none of the inputs have hash=0, n=-1 (coinbase transactions)
    // > The intended purpose of this rule is to prevent relaying of coinbase transactions, since they can only exist in blocks.
    // > Instead of the check mentioned in the rule, we simply look at the `isConbase` field, which is assigned by the miner.
    if (tx.isCoinbase) {
      return 'invalid';
    }

    // tx8. Reject if we already have matching tx in the pool...
    if (this.transactionDatabase.isTxInMempool(txHash)) {
      return 'invalid';
    }

    // if canSearchMainBranchForDupes:
    //   tx8... or in a block in the main branch
    if (
      canSearchMainBranchForDupes &&
      this.blockDatabase.isTxInMainBranch(txHash)
    ) {
      return 'invalid';
    }

    // tx9. For each input, if the referenced output exists in any other tx in the pool, reject this transaction.[5]
    // > Clarification: https://bitcoin.stackexchange.com/questions/103342
    // > The output referenced by the input must not be referenced by another input of a transaction already in the pool.
    for (const input of tx.inputs) {
      if (this.transactionDatabase.isOutPointInMempool(input.previousOutput)) {
        return 'invalid';
      }
    }

    return 'valid';
  };

  //
  // ---- Utils ----
  //
}
