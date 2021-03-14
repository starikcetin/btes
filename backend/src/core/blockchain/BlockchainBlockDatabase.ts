import { Tree } from '../../common/tree/Tree';
import { TreeNode } from '../../common/tree/TreeNode';
import { BlockchainBlockDatabaseSnapshot } from '../../common/blockchain/BlockchainBlockDatabaseSnapshot';
import { BlockchainBlock } from '../../common/blockchain/BlockchainBlock';
import { BlockchainTransaction } from '../../common/blockchain/BlockchainTransaction';
import { hash } from '../../utils/hash';
import { BlockchainTransactionOutPoint } from '../../common/blockchain/BlockchainTransactionOutPoint';
import { areOutPointsEquivalent } from './utils/areOutPointsEquivalent';
import { collectGenerator } from '../../common/utils/collectGenerator';

export class BlockchainBlockDatabase {
  private readonly blocks: Tree<BlockchainBlock>;
  private readonly orphanBlocks: BlockchainBlock[];

  constructor(blocks: Tree<BlockchainBlock>, orphanBlocks: BlockchainBlock[]) {
    this.blocks = blocks;
    this.orphanBlocks = orphanBlocks;
  }

  public readonly takeSnapshot = (): BlockchainBlockDatabaseSnapshot => {
    return {
      blocks: this.blocks.toJsonObject(),
      orphanBlocks: this.orphanBlocks,
    };
  };

  /** Does any block in the main branch include a tx with given hash? */
  public readonly isTxInMainBranch = (txHash: string): boolean => {
    return this.findTxInMainBranch(txHash) !== null;
  };

  /** Finds the block in main branch that has a tx with the given hash. */
  public readonly findTxInMainBranch = (
    txHash: string
  ): {
    tx: BlockchainTransaction;
    block: BlockchainBlock;
    node: TreeNode<BlockchainBlock>;
  } | null => {
    for (const it of this.getMainBranchTxIterator()) {
      if (hash(it.tx) === txHash) {
        return it;
      }
    }

    return null;
  };

  /** Is given outPoint used by any input of any tx of any block in the main branch? */
  public readonly isOutPointInMainBranch = (
    outPoint: BlockchainTransactionOutPoint
  ): boolean => {
    for (const { tx } of this.getMainBranchTxIterator()) {
      const isUsed = tx.inputs.some((input) =>
        areOutPointsEquivalent(input.previousOutput, outPoint)
      );

      if (isUsed) {
        return true;
      }
    }

    return false;
  };

  /**
   * Finds the fork point where this block's ancestory diverged from the main branch.
   *
   * Returns the branch and the fork point seperately. The fork point is NOT included in the branch.
   *
   * Returned branch will be part of (or the whole) main branch if the given block is on the main branch.
   */
  public readonly getBranchAndForkPointFromMainBranch = (
    node: TreeNode<BlockchainBlock>
  ): {
    forkPoint: TreeNode<BlockchainBlock>;
    branch: TreeNode<BlockchainBlock>[];
  } => {
    const collect = collectGenerator(
      this.blocks.getNodeIteratorUntilMainBranchForkPointOrRoot(node)
    );
    return { forkPoint: collect.ret, branch: collect.yields };
  };

  /**
   * * Iterates the main branch head backwards until a node with the given id is hit.
   * * Returns the visited nodes and the stop node seperately. The stop node is NOT included in the visited nodes.
   */
  public readonly getMainBranchUntil = (
    stopNodeHash: string
  ): {
    /** The node with the given id. */
    stopNode: TreeNode<BlockchainBlock>;

    /** The nodes we visited until we hit the stop node. */
    visitedNodes: TreeNode<BlockchainBlock>[];
  } => {
    const collect = collectGenerator(
      this.blocks.getMainBranchIteratorUntil(stopNodeHash)
    );
    return { stopNode: collect.ret, visitedNodes: collect.yields };
  };

  public readonly getMainBranchHead = (): TreeNode<BlockchainBlock> | null =>
    this.blocks.mainBranchHead;

  private *getMainBranchBlockIterator() {
    for (const node of this.blocks.getMainBranchIterator()) {
      yield { block: node.data, node };
    }
  }

  private *getMainBranchTxIterator() {
    for (const { block, node } of this.getMainBranchBlockIterator()) {
      for (const tx of block.transactions) {
        yield { tx, block, node };
      }
    }
  }
}
