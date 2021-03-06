import { BlockchainBlock } from '../../../common/blockchain/block/BlockchainBlock';
import { BlockchainConfig } from '../../../common/blockchain/BlockchainConfig';
import { BlockchainTx } from '../../../common/blockchain/tx/BlockchainTx';
import { TreeNode } from '../../../common/tree/TreeNode';
import { hasValue } from '../../../common/utils/hasValue';
import { BlockchainBlockDb } from '../modules/BlockchainBlockDb';
import { BlockchainTxDb } from '../modules/BlockchainTxDb';
import { checkDifficultyTarget } from '../utils/checkDifficultyTarget';
import { checkProofOfWork } from '../utils/checkProofOfWork';
import { sumOfOutputs } from '../utils/sumOfOutputs';
import { BlockchainCommonChecker } from './BlockchainCommonChecker';
import { BlockchainWallet } from '../modules/BlockchainWallet';
import { hashBlock } from '../../../common/blockchain/utils/hashBlock';
import { hashTx } from '../../../common/blockchain/utils/hashTx';
import { getTxType } from '../../../common/blockchain/utils/getTxType';

export type CheckBlockResult =
  | { validity: 'invalid' | 'orphan' }
  | { validity: 'valid'; parentNode: TreeNode<BlockchainBlock> };

export type AddBlockResult =
  | { isValid: true; canRelay: boolean }
  | { isValid: false; canRelay: false };

export class BlockchainBlockChecker {
  private readonly config: BlockchainConfig;
  private readonly blockDb: BlockchainBlockDb;
  private readonly txDb: BlockchainTxDb;
  private readonly wallet: BlockchainWallet;
  private readonly commonChecker: BlockchainCommonChecker;

  constructor(
    config: BlockchainConfig,
    blockDb: BlockchainBlockDb,
    txDb: BlockchainTxDb,
    wallet: BlockchainWallet,
    commonChecker: BlockchainCommonChecker
  ) {
    this.config = config;
    this.blockDb = blockDb;
    this.txDb = txDb;
    this.wallet = wallet;
    this.commonChecker = commonChecker;
  }

  public readonly checkBlockForReceiveBlock = (
    block: BlockchainBlock
  ): CheckBlockResult => {
    const { header } = block;
    const blockHash = hashBlock(header);

    // bc2. Reject if duplicate of block we have in any of the three categories (main, side, orphan)
    if (this.blockDb.getBlockAnywhere(blockHash).result !== null) {
      return { validity: 'invalid' };
    }

    // bc12. Check that nBits value matches the difficulty rules
    if (
      !checkDifficultyTarget(
        header.leadingZeroCount,
        this.config.targetLeadingZeroCount
      )
    ) {
      return { validity: 'invalid' };
    }

    // CheckBlockContextFree
    // > this was before bc12. in the planning.
    // > we swapped their places so we can return CheckBlockContextFree as-is.
    return this.checkBlockContextFree(block);
  };

  public readonly addBlock = (
    receivedBlock: BlockchainBlock,
    parentNode: TreeNode<BlockchainBlock>
  ): AddBlockResult => {
    // GetBlockAddType
    const addType = this.getBlockAddType(parentNode);

    // if side-extend:
    if (addType === 'side-extend') {
      //  (no-relay) bc17... we don't do anything.
      //  Add block to tree
      this.blockDb.addToBlockchain(receivedBlock, parentNode);
      return { isValid: true, canRelay: false };
    }

    // if main-extend:
    if (addType === 'main-extend') {
      // (relay if valid) AddBlockMainExtend
      const result = this.addBlockMainExtend(receivedBlock);

      // if did not reject:
      if (result === 'valid') {
        // Add block to tree
        this.blockDb.addToBlockchain(receivedBlock, parentNode);
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
        this.blockDb.addToBlockchain(receivedBlock, parentNode);
        return { isValid: true, canRelay: true };
      }

      return { isValid: false, canRelay: false };
    }

    throw new Error(`Fell out of block add type checks! addType is ${addType}`);
  };

  private readonly checkBlockContextFree = (
    block: BlockchainBlock
  ): CheckBlockResult => {
    const { txs: txs, header } = block;
    const blockHash = hashBlock(header);

    // bc3. Transaction list must be non-empty
    if (txs.length === 0) {
      return { validity: 'invalid' };
    }

    // bc4. Block hash must satisfy claimed nBits proof of work
    if (!checkProofOfWork(blockHash, header.leadingZeroCount)) {
      return { validity: 'invalid' };
    }

    // bc6. First transaction must be coinbase, the rest must not be
    if (getTxType(txs[0]) !== 'coinbase') {
      return { validity: 'invalid' };
    }

    if (txs.slice(1).some((t) => getTxType(t) !== 'regular')) {
      return { validity: 'invalid' };
    }

    // bc7. For each transaction, apply "tx" checks 2-4
    // > tx3. and tx4. won't be implemented. only tx2. remains:
    // > tx2. Make sure neither in or out lists are empty
    if (txs.some((t) => t.inputs.length === 0 || t.outputs.length === 0)) {
      return { validity: 'invalid' };
    }

    // bc11. Check if prev block (matching prev hash) is in main branch or side branches If not, ...
    const parentNode = this.blockDb.getBlockInBlockchain(header.previousHash);

    if (parentNode === null) {
      return { validity: 'orphan' };
    }

    return { validity: 'valid', parentNode: parentNode };
  };

  private readonly getBlockAddType = (
    parentNode: TreeNode<BlockchainBlock>
  ): 'main-extend' | 'side-extend' | 'promote' => {
    // bc15. Add block into the tree. There are three cases: (we do not actually add here, poor writing)
    // > no-op: we add to the tree later on.

    const mainBranchHead = this.blockDb.getMainBranchHead();
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
    this.wallet.addToWalletIfMine(...receivedBlock.txs);
    this.cleanupMempool(...receivedBlock.txs);

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
    } = this.blockDb.getBranchAndForkPointFromMainBranch(parentNode);

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
    promotingBlocks.forEach((b) => this.wallet.addToWalletIfMine(...b.txs));

    // bc18.4. If we reject at any point, leave the main branch as what it was originally, done with block
    // > no-op: actually adding the block to the tree is done later on, so we don't have to revert

    // bc18.5. For each block in the old main branch, from the leaf down to the child of the fork block:
    //   ReclaimTxsToMempool
    const { visitedNodes: demotingBlocks } = this.blockDb.getMainBranchUntil(
      sideBranchForkPoint.id
    );

    for (const it of demotingBlocks) {
      this.reclaimTxsToMempool(...it.data.txs);
    }

    // bc18.6. For each block in the new main branch, from the child of the fork node to the leaf: (DON'T FORGET: run these steps for the to-be-added block also!)
    //   CleanupMempool
    promotingBlocks.forEach((b) => this.cleanupMempool(...b.txs));

    return 'valid';
  };

  private readonly reclaimTxsToMempool = (...txs: BlockchainTx[]): void => {
    // bc18.5.1. For each non-coinbase transaction in the block:
    for (const tx of txs) {
      const txType = getTxType(tx);

      if (txType === 'invalid') {
        throw new Error('Tx type is invalid!');
      }

      if (txType === 'coinbase') {
        continue;
      }

      // CheckTxContextFree (canSearchMainBranchForDupes = false) (bc18.5.1.1. Apply "tx" checks 2-9, except in step 8, only look in the transaction pool for duplicates, not the main branch)
      const checkResult = this.commonChecker.checkTxContextFree(tx, {
        canSearchMainBranchForDupes: false,
      });

      // bc18.5.1.2. Add to transaction pool if accepted, else go on to next transaction
      if (checkResult === 'valid') {
        this.txDb.addToMempool(tx);
      }
    }
  };

  private readonly cleanupMempool = (...txs: BlockchainTx[]): void => {
    // bc16.5. & bc18.6.1. For each transaction in the block, delete any matching transaction from the transaction pool
    txs.map(hashTx).forEach(this.txDb.removeFromMempool);
  };

  private readonly checkTxsForReceiveBlock = (
    block: BlockchainBlock
  ): 'invalid' | 'valid' => {
    let sumOfTxFees = 0;

    // bc16.1. For all but the coinbase transaction, apply the following:
    for (const tx of block.txs) {
      const txType = getTxType(tx);

      if (txType === 'invalid') {
        throw new Error('Tx type is invalid!');
      }

      if (txType === 'coinbase') {
        continue;
      }

      // CheckTxForReceive (canSearchMempoolForOutput = false) (reject if orphan)
      const ctxfr = this.commonChecker.checkTxForReceive(tx, {
        canSearchMempoolForOutput: false,
      });

      if (ctxfr.checkResult !== 'valid') {
        return 'invalid';
      }

      const txFee = ctxfr.sumOfInputs - ctxfr.sumOfOutputs;
      sumOfTxFees += txFee;
    }

    // bc16.2. Reject if coinbase value > sum of block creation fee and transaction fees
    if (
      sumOfOutputs(block.txs[0]) >
      this.config.blockCreationFee + sumOfTxFees
    ) {
      return 'invalid';
    }

    return 'valid';
  };
}
