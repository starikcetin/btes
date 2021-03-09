// TODO: how to handle the genesis block? ideally we should ask during simulation init and include it by default in all nodes.

import _ from 'lodash';

import { Tree } from '../../common/tree/Tree';
import { BlockchainBlockDatabaseSnapshot } from '../../common/blockchain/BlockchainBlockDatabaseSnapshot';
import { BlockchainBlock } from '../../common/blockchain/BlockchainBlock';
import { hash } from '../../utils/hash';
import { countLeadingZeroes } from '../../utils/countLeading';
import { TreeNode } from '../../common/tree/TreeNode';
import { BlockchainTransaction } from '../../common/blockchain/BlockchainTransaction';
import { BlockchainTransactionOutPoint } from '../../common/blockchain/BlockchainTransactionOutPoint';

export type BlockchainBlockValidity = 'valid' | 'orphan' | 'invalid';

/**
 * Won't do:
 * 1. Check syntactic correctness
 * 8. For the coinbase (first) transaction, scriptSig length must be 2-100
 * 9. Reject if sum of transaction sig opcounts > MAX_BLOCK_SIGOPS
 * 10. Verify Merkle hash
 *     16.1.6. Using the referenced output transactions to get input values, check that each input value, as well as the sum, are in legal money range
 *       18.3.2.6. Using the referenced output transactions to get input values, check that each input value, as well as the sum, are in legal money range
 * 5. Block timestamp must not be more than two hours in the future
 */

/**
 * Not sure:
 * 12. Check that nBits value matches the difficulty rules
 * 13. Reject if timestamp is the median time of the last 11 blocks or before
 * 14. For certain old blocks (i.e. on initial block download) check that hash matches known values
 *     16.1.4. Verify crypto signatures for each input; reject if any are bad
 *       18.3.2.4. Verify crypto signatures for each input; reject if any are bad
 */

export class BlockchainBlockDatabase {
  private readonly blockCreationFee: number;
  private readonly blocks: Tree<BlockchainBlock>;
  private readonly orphanBlocks: BlockchainBlock[];

  constructor(
    blockCreationFee: number,
    blocks: Tree<BlockchainBlock>,
    orphanBlocks: BlockchainBlock[]
  ) {
    this.blockCreationFee = blockCreationFee;
    this.blocks = blocks;
    this.orphanBlocks = orphanBlocks;
  }

  public readonly receiveBlock = (
    block: BlockchainBlock
  ): BlockchainBlockValidity => {
    const validity = this.isBlockValid(block);
    const headerHash = hash(block.header);

    if (validity === 'orphan') {
      this.orphanBlocks.push(block);

      // TODO:
      // 11.b. then query peer we got this from for 1st missing orphan block in prev chain; done with block
    } else if (validity === 'valid') {
      // 15. Add block into the tree. There are three cases:
      const parentNode = this.blocks.getNode(block.header.previousHash);

      if (null === parentNode) {
        throw new Error('Block is not orphan, but could not find the parent!');
      }

      const addType = this.getAddType(parentNode);

      // a. block further extends the main branch;
      //   16. For case 1, adding to main branch:
      if (addType === 'main-extend') {
        let sumOfTxFees = 0;

        // 16.1. For all but the coinbase transaction, apply the following:
        for (const tx of block.transactions) {
          if (tx.isCoinbase) {
            continue;
          }

          let sumOfInputs = 0;

          for (const input of tx.inputs) {
            const outPoint = input.previousOutput;

            // 16.1.1. For each input, look in the main branch to find the referenced output transaction. Reject if the output transaction is missing for any input.
            const refOutputTx = this.findTxInMainBranch(outPoint.txHash);

            if (null === refOutputTx) {
              return 'invalid';
            }

            // 16.1.2. For each input, if we are using the nth output of the earlier transaction, but it has fewer than n+1 outputs, reject.
            if (refOutputTx.outputs.length < outPoint.outputIndex + 1) {
              return 'invalid';
            }

            // 16.1.3. For each input, if the referenced output transaction is coinbase (i.e. only 1 input, with hash=0, n=-1), it must have at least COINBASE_MATURITY (100) confirmations; else reject.
            if (
              refOutputTx.isCoinbase &&
              !this.isCoinbaseTxMature(refOutputTx)
            ) {
              return 'invalid';
            }

            // 16.1.5. For each input, if the referenced output has already been spent by a transaction in the main branch, reject
            if (this.isOutpointReferencedInMainBranch(outPoint)) {
              return 'invalid';
            }

            const refOutput = refOutputTx.outputs[outPoint.outputIndex];
            sumOfInputs += refOutput.value;
          }

          const sumOfOutputs = this.txSumOfOutputs(tx);

          // 16.1.7. Reject if the sum of input values < sum of output values
          if (sumOfInputs < sumOfOutputs) {
            return 'invalid';
          }

          const txFee = sumOfInputs - sumOfOutputs;
          sumOfTxFees += txFee;
        }

        // 16.2. Reject if coinbase value > sum of block creation fee and transaction fees
        const coinbaseTx = block.transactions[0];
        const sumOfCoinbaseTxOutputs = this.txSumOfOutputs(coinbaseTx);
        if (sumOfCoinbaseTxOutputs > this.blockCreationFee + sumOfTxFees) {
          return 'invalid';
        }

        // 16.3. (If we have not rejected):

        // TODO: 16.4. For each transaction, "Add to wallet if mine"

        // 16.5. For each transaction in the block, delete any matching transaction from the transaction pool
        this.removeTxsFromPool(block);

        // TODO: 16.6. Relay block to our peers

        // 16.7. If we rejected, the block is not counted as part of the main branch
        // > since we only add here, it is not added if we reject before
        this.blocks.createNode(headerHash, block, parentNode);
      }

      if (addType === 'side-extend') {
        //   b. block extends a side branch but does not add enough difficulty to make it become the new main branch;
        //     17. For case 2, adding to a side branch, we don't do anything.
        this.blocks.createNode(headerHash, block, parentNode);
      }

      if (addType === 'promote') {
        // TODO:
        //   c. block extends a side branch and makes it the new main branch.
        //     18. For case 3, a side branch becoming the main branch:
        //       18.1. Find the fork block on the main branch which this side branch forks off of
        //       18.2. Redefine the main branch to only go up to this fork block
        //       18.3. For each block on the side branch, from the child of the fork block to the leaf, add to the main branch:
        //         18.3.1. Do "branch" checks 3-11
        //         18.3.2. For all but the coinbase transaction, apply the following:
        //           18.3.2.1. For each input, look in the main branch to find the referenced output transaction. Reject if the output transaction is missing for any input.
        //           18.3.2.2. For each input, if we are using the nth output of the earlier transaction, but it has fewer than n+1 outputs, reject.
        //           18.3.2.3. For each input, if the referenced output transaction is coinbase (i.e. only 1 input, with hash=0, n=-1), it must have at least COINBASE_MATURITY (100) confirmations; else reject.
        //           18.3.2.5. For each input, if the referenced output has already been spent by a transaction in the main branch, reject
        //           18.3.2.7. Reject if the sum of input values < sum of output values
        //         18.3.3. Reject if coinbase value > sum of block creation fee and transaction fees
        //         18.3.4. (If we have not rejected):
        //         18.3.5. For each transaction, "Add to wallet if mine"
        //       18.4. If we reject at any point, leave the main branch as what it was originally, done with block
        //       18.5. For each block in the old main branch, from the leaf down to the child of the fork block:
        //         18.5.1. For each non-coinbase transaction in the block:
        //           18.5.1.1. Apply "tx" checks 2-9, except in step 8, only look in the transaction pool for duplicates, not the main branch
        //           18.5.1.2. Add to transaction pool if accepted, else go on to next transaction
        //       18.6. For each block in the new main branch, from the child of the fork node to the leaf:
        //           18.6.1. For each transaction in the block, delete any matching transaction from the transaction pool
        //       18.7. Relay block to our peers
      }

      // TODO:
      // 19. For each orphan block for which this block is its prev, run all these steps (including this one) recursively on that orphan
    }

    return validity;
  };

  private readonly removeTxsFromPool = (block: BlockchainBlock) => {
    // TODO: implement
    throw new Error('Method not implemented.');
  };

  private readonly isOutpointReferencedInMainBranch = (
    outPoint: BlockchainTransactionOutPoint
  ) => {
    // TODO: implement
    throw new Error('Method not implemented.');
  };

  private readonly isCoinbaseTxMature = (
    tx: BlockchainTransaction
  ): boolean => {
    // TODO: implement
    return true;
  };

  private readonly findTxInMainBranch = (
    txHash: string
  ): BlockchainTransaction | null => {
    let current = this.blocks.mainBranchHead;

    while (null !== current) {
      for (const tx of current.data.transactions) {
        if (hash(tx) === txHash) {
          return tx;
        }
      }

      current = current.parent;
    }

    return null;
  };

  private readonly isBlockValid = (
    block: BlockchainBlock
  ): BlockchainBlockValidity => {
    const { transactions, header } = block;

    const headerHash = hash(header);

    // 2. Reject if duplicate of block we have in any of the three categories (main, side, orphan)
    if (this.findRegularBlock(headerHash) || this.findOrphanBlock(headerHash)) {
      return 'invalid';
    }

    // 3. Transaction list must be non-empty
    if (transactions.length === 0) {
      return 'invalid';
    }

    // 4. Block hash must satisfy claimed nBits proof of work
    if (countLeadingZeroes(headerHash) !== header.leadingZeroCount) {
      return 'invalid';
    }

    // 6. First transaction must be coinbase, the rest must not be
    if (!transactions[0].isCoinbase) {
      return 'invalid';
    }

    if (_.drop(transactions, 1).some((tx) => tx.isCoinbase)) {
      return 'invalid';
    }

    // 7. For each transaction, apply "tx" checks 2-4
    // > Tx checks 1, 3, and 4 are not implemented, so only tx check #2 remains
    // > Tx check 2: Make sure neither in or out lists are empty
    for (const tx of transactions) {
      if (tx.inputs.length === 0 || tx.outputs.length === 0) {
        return 'invalid';
      }
    }

    // 11.a. Check if prev block (matching prev hash) is in main branch or side branches. If not, add this to orphan blocks,
    if (!this.findRegularBlock(header.previousHash)) {
      return 'orphan';
    }

    // all check passed
    return 'valid';
  };

  private readonly getAddType = (
    parentNode: TreeNode<BlockchainBlock>
  ): 'main-extend' | 'promote' | 'side-extend' => {
    if (this.blocks.mainBranchHead?.id === parentNode.id) {
      // parent is main branch head, we are extending main branch
      return 'main-extend';
    }

    if (null === this.blocks.mainBranchHead) {
      throw new Error('Main branch head is null!');
    }

    if (this.blocks.mainBranchHead.height === parentNode.height) {
      // parent has the same height as the main branch head
      // adding one more block would make it the longest chain
      return 'promote';
    }

    // otherwise we are extending a side branch
    return 'side-extend';
  };

  /** Finds a block in main or side branches */
  private readonly findRegularBlock = (
    blockHeaderHash: string
  ): BlockchainBlock | null =>
    this.blocks.getNode(blockHeaderHash)?.data || null;

  private readonly findOrphanBlock = (
    blockHeaderHash: string
  ): BlockchainBlock | null =>
    this.findBlockInPool(blockHeaderHash, this.orphanBlocks);

  private readonly findBlockInPool = (
    blockHeaderHash: string,
    pool: BlockchainBlock[]
  ): BlockchainBlock | null =>
    pool.find((b) => hash(b.header) === blockHeaderHash) || null;

  private readonly txSumOfOutputs = (tx: BlockchainTransaction) =>
    _.sumBy(tx.outputs, (o) => o.value);

  public readonly takeSnapshot = (): BlockchainBlockDatabaseSnapshot => {
    return {
      blocks: this.blocks.toJsonObject(),
      orphanBlocks: this.orphanBlocks,
    };
  };
}
