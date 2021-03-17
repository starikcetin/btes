import _ from 'lodash';

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

export class BlockchainMiner {
  private readonly socketEmitter: SimulationNamespaceEmitter;
  private readonly nodeUid: string;
  private readonly config: BlockchainConfig;

  private currentState: BlockchainMinerState;
  private activeMinerAborter: MiningAborter | null = null;

  private attemptBatchCounter = 0;
  private readonly attemptBatchLength = 50000;
  private readonly attemptBufferLength = 10;
  private readonly attemptBuffer: MiningAttempt[] = [];

  constructor(
    socketEmitter: SimulationNamespaceEmitter,
    nodeUid: string,
    config: BlockchainConfig,
    state: BlockchainMinerState
  ) {
    this.socketEmitter = socketEmitter;
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
      attemptCount: this.currentState.attemptCount,
      finalAttempt: report.lastAttempt,
    });

    this.attemptBatchCounter = 0;
    this.attemptBuffer.length = 0;
    this.activeMinerAborter = null;

    console.log('miner stopped: ', report);
  };
}
