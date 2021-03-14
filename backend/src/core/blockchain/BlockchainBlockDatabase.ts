import _ from 'lodash';

import { Tree } from '../../common/tree/Tree';
import { TreeNode } from '../../common/tree/TreeNode';
import { BlockchainBlockDatabaseSnapshot } from '../../common/blockchain/BlockchainBlockDatabaseSnapshot';
import { BlockchainBlock } from '../../common/blockchain/BlockchainBlock';
import { BlockchainTransaction } from '../../common/blockchain/BlockchainTransaction';
import { hash } from '../../utils/hash';
import { BlockchainTransactionOutPoint } from '../../common/blockchain/BlockchainTransactionOutPoint';
import { areOutPointsEquivalent } from './utils/areOutPointsEquivalent';
import { collectGenerator } from '../../common/utils/collectGenerator';
import { hasValue } from '../../common/utils/hasValue';

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

  /**
   * Adds the `block` to the blockchain unconditionally.
   * @returns the `TreeNode` created for the `block`.
   */
  public readonly addToBlockchain = (
    block: BlockchainBlock,
    parentNode: TreeNode<BlockchainBlock>
  ): TreeNode<BlockchainBlock> => {
    const id = hash(block.header);
    return this.blocks.createNode(id, block, parentNode);
  };

  /** Finds the block with the given hash in main or side branches. Does NOT search the orphanage. */
  public readonly getBlockInBlockchain = (
    blockHash: string
  ): TreeNode<BlockchainBlock> | null => this.blocks.getNode(blockHash);

  /** Finds the block with the given hash in the orphanage. Does NOT search the blockchain. */
  public readonly getBlockInOrphanage = (
    blockHash: string
  ): BlockchainBlock | null =>
    this.orphanBlocks.find((b) => hash(b.header) === blockHash) ?? null;

  /** Finds a block with the given hash. First looks in the blockchain, then in the orphanage. */
  public readonly getBlockAnywhere = (
    blockHash: string
  ):
    | { foundIn: 'blockchain'; result: TreeNode<BlockchainBlock> }
    | { foundIn: 'orphanage'; result: BlockchainBlock }
    | { foundIn: 'none'; result: null } => {
    const orphanageResult = this.getBlockInOrphanage(blockHash);
    if (hasValue(orphanageResult)) {
      return { foundIn: 'orphanage', result: orphanageResult };
    }

    const blockchainResult = this.getBlockInBlockchain(blockHash);
    if (hasValue(blockchainResult)) {
      return { foundIn: 'blockchain', result: blockchainResult };
    }

    return { foundIn: 'none', result: null };
  };

  /** Adds the `block` to the orphanage unconditionally. */
  public readonly addToOrphanage = (block: BlockchainBlock): void => {
    this.orphanBlocks.push(block);
  };

  /** Removes all blocks from the orphanage which has the given block as their parent, and returns them. */
  public readonly popOrphansWithParent = (
    parentHash: string
  ): BlockchainBlock[] =>
    _.remove(this.orphanBlocks, (b) => b.header.previousHash === parentHash);

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
