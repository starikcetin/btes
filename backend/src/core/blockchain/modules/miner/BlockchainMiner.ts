import { BlockchainMinerSnapshot } from '../../../../common/blockchain/snapshots/BlockchainMinerSnapshot';
import { BlockchainConfig } from '../../../../common/blockchain/BlockchainConfig';
import { SimulationNamespaceEmitter } from '../../../SimulationNamespaceEmitter';
import { BlockchainMinerState } from '../../../../common/blockchain/miner/BlockchainMinerStateData';
import { BlockchainMiningTask } from '../../../../common/blockchain/miner/BlockchainMiningTask';
import {
  beginMining,
  MiningAborter,
  MiningAttemptHandler,
  MiningFinishHandler,
  MiningFinishReport,
} from './beginMining';
import { MiningAttempt } from '../../../../common/blockchain/miner/MiningAttempt';
import { hasValue } from '../../../../common/utils/hasValue';
import { BlockchainNetwork } from '../BlockchainNetwork';
import { BlockchainBlock } from '../../../../common/blockchain/block/BlockchainBlock';
import { BlockchainBlockTemplate } from '../../../../common/blockchain/miner/BlockchainBlockTemplate';
import { BlockchainBlockDb } from '../BlockchainBlockDb';
import { BlockchainTxDb } from '../BlockchainTxDb';
import { BlockchainTx } from '../../../../common/blockchain/tx/BlockchainTx';

export class BlockchainMiner {
  private readonly socketEmitter: SimulationNamespaceEmitter;
  private readonly network: BlockchainNetwork;
  private readonly blockDb: BlockchainBlockDb;
  private readonly txDb: BlockchainTxDb;
  private readonly nodeUid: string;
  private readonly config: BlockchainConfig;

  private currentState: BlockchainMinerState;
  private activeMinerAborter: MiningAborter | null = null;
  private successfulAttempt: MiningAttempt | null = null;

  private attemptBatchCounter = 0;
  private readonly attemptBatchLength = 50000;
  private readonly attemptBufferLength = 10;
  private readonly attemptBuffer: MiningAttempt[] = [];

  constructor(
    socketEmitter: SimulationNamespaceEmitter,
    network: BlockchainNetwork,
    blockDb: BlockchainBlockDb,
    txDb: BlockchainTxDb,
    nodeUid: string,
    config: BlockchainConfig,
    state: BlockchainMinerState
  ) {
    this.socketEmitter = socketEmitter;
    this.network = network;
    this.blockDb = blockDb;
    this.txDb = txDb;
    this.nodeUid = nodeUid;
    this.config = config;

    /*
     * TODO: when we do the save/load simulation jobs, we should resume mining
     * here if the state was that way when we left off. we already have the nonce
     * in the `working` state.
     * ~~ Tarık, 2021-03-17
     */
    this.currentState = state;
  }

  public readonly takeSnapshot = (): BlockchainMinerSnapshot => {
    return {
      currentState: this.currentState,
    };
  };

  public readonly startMining = (task: BlockchainMiningTask): void => {
    if (this.currentState.state === 'working') {
      console.warn(
        'Ignoring `startMining`: The miner is already in working state.'
      );
      return;
    }

    this.updateState({
      state: 'working',
      task,
      attemptCount: 0,
      recentAttempts: [],
    });

    this.mine();
  };

  public readonly abortMining = (): void => {
    if (this.currentState.state !== 'working') {
      console.warn(
        'Ignoring `abortMining`: The miner is not in working state.'
      );
      return;
    }

    if (!hasValue(this.activeMinerAborter)) {
      throw new Error(
        `Miner is in working state but activeMinerAborter is ${this.activeMinerAborter}`
      );
    }

    this.activeMinerAborter();
  };

  private readonly updateState = (newState: BlockchainMinerState): void => {
    this.currentState = newState;

    this.socketEmitter.sendBlockchainMinerStateUpdated({
      nodeUid: this.nodeUid,
      newState,
    });
  };

  public readonly dismissStoppedState = (): void => {
    this.updateState({ state: 'idle' });
    this.successfulAttempt = null;
  };

  public readonly assembleMinedBlock = (): BlockchainBlock => {
    if (this.currentState.state !== 'stopped') {
      throw new Error(
        `Miner expected 'stopepd' state, but it is: ${this.currentState}`
      );
    }

    if (this.currentState.stopReason !== 'success') {
      throw new Error(
        `Miner expected 'success' stop reason, but it is: ${this.currentState.stopReason}`
      );
    }

    if (!hasValue(this.successfulAttempt)) {
      throw new Error(
        `Miner expected a 'successfulAttempt', but it is: ${this.successfulAttempt}`
      );
    }

    return this.assembleBlock(
      this.currentState.task.blockTemplate,
      this.successfulAttempt
    );

    // Deprecated: See the comment above the method definition.
    // this.acceptMinedBlock(
    //   block,
    //   this.currentState.task.blockTemplate.includedTxHashes
    // );
  };

  private readonly assembleBlock = (
    template: BlockchainBlockTemplate,
    successfulAttempt: MiningAttempt
  ): BlockchainBlock => {
    const coinbaseTx = this.assembleCoinbaseTx(template);

    // TODO: maybe we should do this before starting mining. that way minimizing the chance of missing or overwritten txs after mining.
    const includedTxs = template.includedTxHashes
      .map(this.txDb.findTxInMempool)
      .filter(hasValue);

    return {
      header: {
        previousHash: template.previousHash,
        leadingZeroCount: template.difficultyTarget,
        timestamp: successfulAttempt.timestamp,
        nonce: successfulAttempt.nonce,
      },
      txs: [coinbaseTx, ...includedTxs],
    };
  };

  private readonly assembleCoinbaseTx = (
    template: BlockchainBlockTemplate
  ): BlockchainTx => {
    return {
      inputs: [
        {
          isCoinbase: true,
          coinbase: template.coinbase,
        },
      ],
      outputs: [
        {
          value: template.value + template.includedTxsTotalFee,
          lockingScript: {
            address: template.recipientAddress,
          },
        },
      ],
    };
  };

  private readonly mine = () => {
    if (this.currentState.state !== 'working') {
      throw new Error(
        `Miner expected 'working' state, but it is: ${this.currentState}`
      );
    }

    this.activeMinerAborter = beginMining(
      this.currentState.task,
      this.attemptHandler,
      this.finishHandler
    );
  };

  private readonly attemptHandler: MiningAttemptHandler = (
    attempt: MiningAttempt
  ) => {
    if (this.currentState.state !== 'working') {
      throw new Error(
        `Miner expected 'working' state, but it is: ${this.currentState}`
      );
    }

    this.attemptBatchCounter++;

    if (
      this.attemptBatchCounter + this.attemptBufferLength >
      this.attemptBatchLength
    ) {
      this.attemptBuffer.push(attempt);
    }

    if (this.attemptBatchCounter >= this.attemptBatchLength) {
      this.updateState({
        state: 'working',
        task: this.currentState.task,
        attemptCount: this.currentState.attemptCount + this.attemptBatchCounter,
        recentAttempts: this.attemptBuffer,
      });

      this.attemptBatchCounter = 0;
      this.attemptBuffer.length = 0;
    }
  };

  private readonly finishHandler: MiningFinishHandler = (
    report: MiningFinishReport
  ) => {
    if (this.currentState.state !== 'working') {
      throw new Error(
        `Miner expected 'working' state, but it is: ${this.currentState}`
      );
    }

    this.updateState({
      state: 'stopped',
      stopReason: report.reason,
      task: this.currentState.task,
      attemptCount: this.currentState.attemptCount + this.attemptBatchCounter,
      finalAttempt: report.lastAttempt,
    });

    this.successfulAttempt = report.lastAttempt;
    this.attemptBatchCounter = 0;
    this.attemptBuffer.length = 0;
    this.activeMinerAborter = null;

    // console.log('miner stopped: ', report);
  };

  // Previously, I wanted to implement it such that the nodes accept their own blocks without checks.
  // However, it proved difficult to implement and started to introduce many code duplications.
  // Therefore I decided to give that up and make nodes run their own blocks through the same procedure
  // that foreign blocks go through. Therefore, this method is now obsolete, but I am commenting it out
  // instead of removing it; in case we want to return back to this in the future.
  // ~~ Tarık, 2021-04-10 23:57
  //
  // private readonly acceptMinedBlock = (
  //   block: BlockchainBlock,
  //   includedTxHashes: string[]
  // ) => {
  //   // Pop included txs from mempool
  //   includedTxHashes.forEach(this.txDb.removeFromMempool);
  //
  //   const parent = this.blockDb.getBlockInBlockchain(block.header.previousHash);
  //
  //   // add to own block db
  //   if (hasValue(parent)) {
  //     this.blockDb.addToBlockchain(block, parent);
  //   } else {
  //     console.warn(
  //       'miner could not find the parent block in its own database, adding to orphanage. block hash:',
  //       block.header.previousHash
  //     );
  //     this.blockDb.addToOrphanage(block);
  //   }
  //
  //   // broadcast to other nodes
  //   this.network.broadcastBlock(block);
  // };
}
