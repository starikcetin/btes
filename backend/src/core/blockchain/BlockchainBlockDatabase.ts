import { Tree } from '../../common/tree/Tree';
import { TreeNode } from '../../common/tree/TreeNode';
import { BlockchainBlockDatabaseSnapshot } from '../../common/blockchain/BlockchainBlockDatabaseSnapshot';
import { BlockchainBlock } from '../../common/blockchain/BlockchainBlock';
import { BlockchainTransaction } from '../../common/blockchain/BlockchainTransaction';
import { hash } from '../../utils/hash';
import { BlockchainTransactionOutPoint } from '../../common/blockchain/BlockchainTransactionOutPoint';
import { areOutPointsEquivalent } from './utils/areOutPointsEquivalent';

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
