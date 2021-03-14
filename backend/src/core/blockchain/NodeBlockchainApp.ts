// TODO: how to handle the genesis block? ideally we should ask during simulation init and include it by default in all nodes.

import _ from 'lodash';

import { NodeBlockchainAppSnapshot } from '../../common/blockchain/NodeBlockchainAppSnapshot';
import { BlockchainWallet } from './BlockchainWallet';
import { BlockchainTransactionDatabase } from './BlockchainTransactionDatabase';
import { BlockchainBlockDatabase } from './BlockchainBlockDatabase';
import { BlockchainTransaction } from '../../common/blockchain/BlockchainTransaction';
import { hash } from '../../utils/hash';
import { BlockchainBlock } from '../../common/blockchain/BlockchainBlock';
import { TreeNode } from '../../common/tree/TreeNode';
import { BlockchainUnlockingScript } from '../../common/blockchain/BlockchainUnlockingScript';
import { BlockchainLockingScript } from '../../common/blockchain/BlockchainLockingScript';
import { sumOfOutputs } from './utils/sumOfOutputs';
import { hasValue } from '../../common/utils/hasValue';
import { countLeadingZeroes } from '../../utils/countLeading';

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

  private readonly checkBlockContextFree = (
    block: BlockchainBlock
  ): {
    validity: 'invalid' | 'orphan' | 'valid';
    parentNode: TreeNode<BlockchainBlock> | null;
  } => {
    const { transactions: txs, header } = block;
    const blockHash = hash(header);

    // bc3. Transaction list must be non-empty
    if (txs.length === 0) {
      return { validity: 'invalid', parentNode: null };
    }

    // bc4. Block hash must satisfy claimed nBits proof of work
    if (!this.checkProofOfWork(blockHash, header.leadingZeroCount)) {
      return { validity: 'invalid', parentNode: null };
    }

    // bc6. First transaction must be coinbase, the rest must not be
    if (txs[0].isCoinbase === false) {
      return { validity: 'invalid', parentNode: null };
    }

    if (txs.slice(1).some((t) => t.isCoinbase)) {
      return { validity: 'invalid', parentNode: null };
    }

    // bc7. For each transaction, apply "tx" checks 2-4
    // > tx3. and tx4. won't be implemented. only tx2. remains:
    // > tx2. Make sure neither in or out lists are empty
    if (txs.some((t) => t.inputs.length === 0 || t.outputs.length === 0)) {
      return { validity: 'invalid', parentNode: null };
    }

    // bc11. Check if prev block (matching prev hash) is in main branch or side branches If not, ...
    const parentNode = this.blockDatabase.getBlockInBlockchain(
      header.previousHash
    );

    if (parentNode === null) {
      return { validity: 'orphan', parentNode: null };
    }

    return { validity: 'valid', parentNode: parentNode };
  };

  private readonly addBlock = (
    receivedBlock: BlockchainBlock,
    parentNode: TreeNode<BlockchainBlock>
  ): { isValid: boolean; canRelay: boolean } => {
    // GetBlockAddType
    const addType = this.getBlockAddType(parentNode);

    // if side-extend:
    if (addType === 'side-extend') {
      //  (no-relay) bc17... we don't do anything.
      //  Add block to tree
      this.blockDatabase.addToBlockchain(receivedBlock, parentNode);
      return { isValid: true, canRelay: false };
    }

    // if main-extend:
    if (addType === 'main-extend') {
      // (relay if valid) AddBlockMainExtend
      const result = this.addBlockMainExtend(receivedBlock);

      // if did not reject:
      if (result === 'valid') {
        // Add block to tree
        this.blockDatabase.addToBlockchain(receivedBlock, parentNode);
        return { isValid: true, canRelay: true };
      }

      return { isValid: false, canRelay: false };
    }

    // if promote:
    if (addType === 'promote') {
      // (relay if valid) AddBlockPromote
      const result = this.addBlockPromote(receivedBlock, parentNode);

      // if did not reject:
      if (result === 'valid') {
        // Add block to tree
        this.blockDatabase.addToBlockchain(receivedBlock, parentNode);
        return { isValid: true, canRelay: true };
      }

      return { isValid: false, canRelay: false };
    }

    throw new Error(`Fell out of block add type checks! addType is ${addType}`);
  };

  private readonly getBlockAddType = (
    parentNode: TreeNode<BlockchainBlock>
  ): 'main-extend' | 'side-extend' | 'promote' => {
    // bc15. Add block into the tree. There are three cases: (we do not actually add here, poor writing)
    // > no-op: we add to the tree later on.

    const mainBranchHead = this.blockDatabase.getMainBranchHead();
    if (!hasValue(mainBranchHead)) {
      throw new Error(`Main branch head is ${mainBranchHead}!`);
    }

    // bc16. For case 1, adding to main branch:
    // > if parent is the main branch head, we are extending the main branch
    if (mainBranchHead.id === parentNode.id) {
      return 'main-extend';
    }

    // bc18. For case 3, a side branch becoming the main branch:
    // > if parent has the same height as the main branch head, adding one more block would make it the longest chain
    if (mainBranchHead.height === parentNode.height) {
      return 'promote';
    }

    // bc17. For case 2, adding to a side branch...
    // > if previous checks did not hit, we are extending a side branch
    return 'side-extend';
  };

  private readonly addBlockMainExtend = (
    receivedBlock: BlockchainBlock
  ): 'invalid' | 'valid' => {
    // CheckTxsForReceiveBlock
    if (this.checkTxsForReceiveBlock(receivedBlock) !== 'valid') {
      return 'invalid';
    }

    // bc16.3. (If we have not rejected):
    //   AddToWalletIfMine
    //   CleanupMempool
    this.addToWalletIfMine(...receivedBlock.transactions);
    this.cleanupMempool(...receivedBlock.transactions);

    // bc16.7. If we rejected, the block is not counted as part of the main branch
    // > no-op: actually adding to the tree is done later on

    return 'valid';
  };

  private readonly addBlockPromote = (
    receivedBlock: BlockchainBlock,
    parentNode: TreeNode<BlockchainBlock>
  ): 'invalid' | 'valid' => {
    // bc18.1. Find the fork block on the main branch which this side branch forks off of
    const {
      forkPoint: sideBranchForkPoint,
      branch: sideBranch,
    } = this.blockDatabase.getBranchAndForkPointFromMainBranch(parentNode);

    const promotingBlocks = [receivedBlock, ...sideBranch.map((n) => n.data)];

    // bc18.2. Redefine the main branch to only go up to this fork block
    // > no-op: this step doesn't make sense for our data structure

    // bc18.3. For each block on the side branch, from the child of the fork block to the leaf, add to the main branch: (DON'T FORGET: run these steps for the to-be-added block also!)
    for (const it of promotingBlocks) {
      // CheckBlockContextFree (bc18.3.1. Do "branch" checks 3-11) (result can never be orphan, because it was in the chain already)
      if (this.checkBlockContextFree(it).validity !== 'valid') {
        return 'invalid';
      }

      // CheckTxsForReceiveBlock
      if (this.checkTxsForReceiveBlock(it) !== 'valid') {
        return 'invalid';
      }
    }

    // bc18.3.4. (If we have not rejected): (note: this part is in the above loop in the original algo. it makes more sense this way because we don't have to revert if we reject.)
    //   AddToWalletIfMine (for each block in promoted branch and the received block)
    promotingBlocks.forEach((b) => this.addToWalletIfMine(...b.transactions));

    // bc18.4. If we reject at any point, leave the main branch as what it was originally, done with block
    // > no-op: actually adding the block to the tree is done later on, so we don't have to revert

    // bc18.5. For each block in the old main branch, from the leaf down to the child of the fork block:
    //   ReclaimTxsToMempool
    const {
      visitedNodes: demotingBlocks,
    } = this.blockDatabase.getMainBranchUntil(sideBranchForkPoint.id);

    for (const it of demotingBlocks) {
      this.reclaimTxsToMempool(...it.data.transactions);
    }

    // bc18.6. For each block in the new main branch, from the child of the fork node to the leaf: (DON'T FORGET: run these steps for the to-be-added block also!)
    //   CleanupMempool
    promotingBlocks.forEach((b) => this.cleanupMempool(...b.transactions));

    return 'valid';
  };

  private readonly reclaimTxsToMempool = (
    ...txs: BlockchainTransaction[]
  ): void => {
    // bc18.5.1. For each non-coinbase transaction in the block:
    for (const tx of txs) {
      if (tx.isCoinbase) {
        continue;
      }

      // CheckTxContextFree (canSearchMainBranchForDupes = false) (bc18.5.1.1. Apply "tx" checks 2-9, except in step 8, only look in the transaction pool for duplicates, not the main branch)
      const checkResult = this.checkTxContextFree(tx, {
        canSearchMainBranchForDupes: false,
      });

      // bc18.5.1.2. Add to transaction pool if accepted, else go on to next transaction
      if (checkResult === 'valid') {
        this.transactionDatabase.addTxToMempool(tx);
      }
    }
  };

  private readonly addToWalletIfMine = (
    ...txs: BlockchainTransaction[]
  ): void => {
    /*
     * AddToWalletIfMine:
     *   bc16.4. & bc18.3.5. For each transaction, "Add to wallet if mine"
     */
    // TODO: implement
  };

  private readonly cleanupMempool = (...txs: BlockchainTransaction[]): void => {
    // bc16.5. & bc18.6.1. For each transaction in the block, delete any matching transaction from the transaction pool
    txs.map(hash).forEach(this.transactionDatabase.removeFromMempool);
  };

  private readonly checkTxsForReceiveBlock = (
    block: BlockchainBlock
  ): 'invalid' | 'valid' => {
    let sumOfTxFees = 0;

    // bc16.1. For all but the coinbase transaction, apply the following:
    for (const tx of block.transactions) {
      if (tx.isCoinbase) {
        continue;
      }

      // CheckTxForReceive (canSearchMempoolForOutput = false) (reject if orphan)
      const { checkResult, sumOfInputs, sumOfOutputs } = this.checkTxForReceive(
        tx,
        {
          canSearchMempoolForOutput: false,
        }
      );

      if (checkResult !== 'valid') {
        return 'invalid';
      }

      const txFee = sumOfInputs - sumOfOutputs;
      sumOfTxFees += txFee;
    }

    // bc16.2. Reject if coinbase value > sum of block creation fee and transaction fees
    if (
      sumOfOutputs(block.transactions[0]) >
      this.blockCreationFee + sumOfTxFees
    ) {
      return 'invalid';
    }

    return 'valid';
  };

  //
  // ---- Common ----
  //

  /** `sumOfInputs` and `sumOfOutputs` will be `-1` if `checkResult` is not `valid` */
  private readonly checkTxForReceive = (
    tx: BlockchainTransaction,
    options: {
      canSearchMempoolForOutput: boolean;
    }
  ): {
    checkResult: 'orphan' | 'invalid' | 'valid';
    sumOfInputs: number;
    sumOfOutputs: number;
  } => {
    const { canSearchMempoolForOutput } = options;

    let sumOfInputs = 0;

    for (const input of tx.inputs) {
      const { previousOutput, unlockingScript } = input;

      // tx10. & bc16.1.1. For each input, look in the main branch (if canSearchMempoolForOutput: also look in the transaction pool) to find the referenced output transaction. If the output transaction is missing for any input, this will be an orphan transaction...
      const refOutputLookup = this.checkTxForReceive_txLookup(
        previousOutput.txHash,
        canSearchMempoolForOutput
      );

      if (refOutputLookup === null) {
        return { checkResult: 'orphan', sumOfInputs: -1, sumOfOutputs: -1 };
      }

      const { tx: refOutputTx, node: refOutputNode } = refOutputLookup;

      // bc16.1.2. For each input, if we are using the nth output of the earlier transaction, but it has fewer than n+1 outputs, reject.
      if (refOutputTx.outputs.length < previousOutput.outputIndex + 1) {
        return { checkResult: 'invalid', sumOfInputs: -1, sumOfOutputs: -1 };
      }

      const refOutput = refOutputTx.outputs[previousOutput.outputIndex];
      sumOfInputs += refOutput.value;

      // tx11. & bc16.1.3. For each input, if the referenced output transaction is coinbase, it must have at least COINBASE_MATURITY confirmations; else reject this transaction
      if (refOutputTx.isCoinbase) {
        if (refOutputNode === null) {
          throw new Error(
            'refOutputTx is coinbase, but refOutputNode is null!'
          );
        }

        if (refOutputNode.depth < this.coinbaseMaturity) {
          return { checkResult: 'invalid', sumOfInputs: -1, sumOfOutputs: -1 };
        }
      }

      // tx12. & bc16.1.5. For each input, if the referenced output does not exist (e.g. never existed or has already been spent), reject this transaction[6]
      // > existence is checked by tx10 and bc16.1.2 rules. we only need to check if it was spent before.
      if (this.blockDatabase.isOutPointInMainBranch(previousOutput)) {
        return { checkResult: 'invalid', sumOfInputs: -1, sumOfOutputs: -1 };
      }

      // tx16. & bc16.1.4. Verify the scriptPubKey accepts for each input; reject if any are bad
      if (!this.verifyScripts(refOutput.lockingScript, unlockingScript)) {
        return { checkResult: 'invalid', sumOfInputs: -1, sumOfOutputs: -1 };
      }
    }

    const sumOfOutputs = _.sumBy(tx.outputs, (o) => o.value);
    // tx14. & bc16.1.7. Reject if the sum of input values < sum of output values
    if (sumOfInputs < sumOfOutputs) {
      return { checkResult: 'invalid', sumOfInputs: -1, sumOfOutputs: -1 };
    }

    return { checkResult: 'valid', sumOfInputs, sumOfOutputs };
  };

  private readonly checkTxContextFree = (
    tx: BlockchainTransaction,
    options: {
      canSearchMainBranchForDupes: boolean;
    }
  ): 'invalid' | 'valid' => {
    const { canSearchMainBranchForDupes } = options;
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

  private readonly checkTxForReceive_txLookup = (
    txHash: string,
    canSearchMempool: boolean
  ): {
    tx: BlockchainTransaction;
    block: BlockchainBlock | null;
    node: TreeNode<BlockchainBlock> | null;
  } | null => {
    const lookupFromMainBranch = this.blockDatabase.findTxInMainBranch(txHash);

    if (lookupFromMainBranch !== null) {
      return lookupFromMainBranch;
    }

    if (canSearchMempool) {
      const lookupFromMempool = this.transactionDatabase.findTxInMempool(
        txHash
      );

      if (lookupFromMempool !== null) {
        return {
          block: null,
          node: null,
          tx: lookupFromMempool,
        };
      }
    }

    return null;
  };

  private readonly verifyScripts = (
    lockingScript: BlockchainLockingScript,
    unlockingScript: BlockchainUnlockingScript
  ): boolean => {
    // TODO: implement
    throw new Error('Method not implemented.');
  };

  /** Checks if the given `hash` has at least given `leadingZeroCount`. */
  private readonly checkProofOfWork = (
    hash: string,
    leadingZeroCount: number
  ) => {
    return countLeadingZeroes(hash) >= leadingZeroCount;
  };
}
