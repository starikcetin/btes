import _ from 'lodash';

import { Tree } from '../../../common/tree/Tree';
import { TreeNode } from '../../../common/tree/TreeNode';
import { BlockchainBlockDbSnapshot } from '../../../common/blockchain/snapshots/BlockchainBlockDbSnapshot';
import { BlockchainBlock } from '../../../common/blockchain/block/BlockchainBlock';
import { BlockchainTx } from '../../../common/blockchain/tx/BlockchainTx';
import { BlockchainTxOutPoint } from '../../../common/blockchain/tx/BlockchainTxOutPoint';
import { areOutPointsEqual } from '../utils/areOutPointsEqual';
import { collectGenerator } from '../../../common/utils/collectGenerator';
import { hasValue } from '../../../common/utils/hasValue';
import { hashTx } from '../../../common/blockchain/utils/hashTx';
import { hashBlock } from '../../../common/blockchain/utils/hashBlock';
import { SimulationNamespaceEmitter } from '../../SimulationNamespaceEmitter';
import { makeGenesisBlock } from '../utils/makeGenesisBlock';

export type BlockSearchResult =
  | { foundIn: 'blockchain'; result: TreeNode<BlockchainBlock> }
  | { foundIn: 'orphanage'; result: BlockchainBlock }
  | { foundIn: 'none'; result: null };

export class BlockchainBlockDb {
  private readonly socketEmitter: SimulationNamespaceEmitter;
  private readonly nodeUid: string;
  private readonly blockchain: Tree<BlockchainBlock>;
  private readonly orphanage: BlockchainBlock[];

  constructor(
    socketEmitter: SimulationNamespaceEmitter,
    nodeUid: string,
    blocks: Tree<BlockchainBlock>,
    orphanBlocks: BlockchainBlock[]
  ) {
    this.socketEmitter = socketEmitter;
    this.nodeUid = nodeUid;
    this.blockchain = blocks;
    this.orphanage = orphanBlocks;

    if (!hasValue(blocks.root)) {
      // if we don't have a root, the tree is empty. so register the genesis block.
      this.addGenesis();
    }
  }

  public readonly takeSnapshot = (): BlockchainBlockDbSnapshot => {
    return {
      blockchain: this.blockchain.toJsonObject(),
      orphanage: this.orphanage,
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
    tx: BlockchainTx;
    block: BlockchainBlock;
    node: TreeNode<BlockchainBlock>;
  } | null => {
    for (const it of this.getMainBranchTxIterator()) {
      if (hashTx(it.tx) === txHash) {
        return it;
      }
    }

    return null;
  };

  /** Is given outPoint used by any input of any tx of any block in the main branch? */
  public readonly isOutPointInMainBranch = (
    outPoint: BlockchainTxOutPoint
  ): boolean => {
    for (const { tx } of this.getMainBranchTxIterator()) {
      if (tx.isCoinbase) {
        continue;
      }

      const isUsed = tx.inputs.some((input) =>
        areOutPointsEqual(input.previousOutput, outPoint)
      );

      if (isUsed) {
        return true;
      }
    }

    return false;
  };

  /**
   * * Finds the fork point where this block's ancestory diverged from the main branch.
   * * Returned branch will be part of (or the whole) main branch if the given block is on the main branch.
   * @returns the branch and the fork point seperately. The fork point is NOT included in the branch.
   */
  public readonly getBranchAndForkPointFromMainBranch = (
    node: TreeNode<BlockchainBlock>
  ): {
    forkPoint: TreeNode<BlockchainBlock>;
    branch: TreeNode<BlockchainBlock>[];
  } => {
    const collect = collectGenerator(
      this.blockchain.getNodeIteratorUntilMainBranchForkPointOrRoot(node)
    );
    return { forkPoint: collect.ret, branch: collect.yields };
  };

  /**
   * Iterates the main branch head backwards until a node with the given id is hit.
   * @returns the visited nodes and the stop node seperately. The stop node is NOT included in the visited nodes.
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
      this.blockchain.getMainBranchIteratorUntil(stopNodeHash)
    );
    return { stopNode: collect.ret, visitedNodes: collect.yields };
  };

  public readonly getMainBranchHead = (): TreeNode<BlockchainBlock> | null =>
    this.blockchain.mainBranchHead;

  /**
   * Adds the `block` to the blockchain unconditionally.
   * @returns the `TreeNode` created for the `block`.
   */
  public readonly addToBlockchain = (
    block: BlockchainBlock,
    parentNode: TreeNode<BlockchainBlock>
  ): TreeNode<BlockchainBlock> => {
    const id = hashBlock(block.header);
    const node = this.blockchain.createNode(id, block, parentNode);

    this.socketEmitter.sendBlockAddedToBlockchain({
      nodeUid: this.nodeUid,
      treeNode: node.toJsonObject(),
    });

    return node;
  };

  /** Finds the block with the given hash in main or side branches. Does NOT search the orphanage. */
  public readonly getBlockInBlockchain = (
    blockHash: string
  ): TreeNode<BlockchainBlock> | null => this.blockchain.getNode(blockHash);

  /** Finds the block with the given hash in the orphanage. Does NOT search the blockchain. */
  public readonly getBlockInOrphanage = (
    blockHash: string
  ): BlockchainBlock | null =>
    this.orphanage.find((b) => hashBlock(b.header) === blockHash) ?? null;

  /** Finds a block with the given hash. First looks in the blockchain, then in the orphanage. */
  public readonly getBlockAnywhere = (blockHash: string): BlockSearchResult => {
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
    this.orphanage.push(block);

    this.socketEmitter.sendBlockAddedToOrphanage({
      nodeUid: this.nodeUid,
      block,
    });
  };

  /** Removes all blocks from the orphanage which has the given block as their parent, and returns them. */
  public readonly popOrphansWithParent = (
    parentHash: string
  ): BlockchainBlock[] => {
    const poppedOrphans = _.remove(
      this.orphanage,
      (b) => b.header.previousHash === parentHash
    );

    if (poppedOrphans.length > 0) {
      this.socketEmitter.sendBlocksRemovedFromOrphanage({
        nodeUid: this.nodeUid,
        removedBlockHashes: poppedOrphans.map((o) => hashBlock(o.header)),
      });
    }

    return poppedOrphans;
  };

  /** Adds the genesis block. */
  private readonly addGenesis = (): void => {
    // TODO: generating the genesis block can be done at the very beginning of the simulation.
    // that way we can simply reuse it instead of generating it every time. That way we can also
    // parameterize it at the beginning of the simulation.
    const genesisBlock = makeGenesisBlock();

    const id = hashBlock(genesisBlock.header);
    this.blockchain.createNode(id, genesisBlock, null);

    // We don't need a separate socket event for genesis block,
    // it must be already included in the very first snapshot.
  };

  private *getMainBranchBlockIterator() {
    for (const node of this.blockchain.getMainBranchIterator()) {
      yield { block: node.data, node };
    }
  }

  private *getMainBranchTxIterator() {
    for (const { block, node } of this.getMainBranchBlockIterator()) {
      for (const tx of block.txs) {
        yield { tx, block, node };
      }
    }
  }
}
