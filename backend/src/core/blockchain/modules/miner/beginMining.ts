/**
 * This is a mining worker used by the BlockchainMiner module.
 */

import { BlockchainBlockHeader } from '../../../../common/blockchain/block/BlockchainBlockHeader';
import { BlockchainMiningTask } from '../../../../common/blockchain/miner/BlockchainMiningTask';
import { hashBlock } from '../../../../common/blockchain/utils/hashBlock';
import { checkProofOfWork } from '../../utils/checkProofOfWork';
import { BlockchainBlockTemplate } from '../../../../common/blockchain/miner/BlockchainBlockTemplate';
import { MiningAttempt } from '../../../../common/blockchain/miner/MiningAttempt';
import { hasValue } from '../../../../common/utils/hasValue';

export type MiningAborter = () => void;
export type MiningAttemptHandler = (attempt: MiningAttempt) => void;
export type MiningFinishHandler = (stopReport: MiningFinishReport) => void;

export type MiningFinishReport = MiningAbortReport | MiningSuccessReport;

export interface MiningAbortReport {
  reason: 'aborted';
  lastAttempt: MiningAttempt | null;
}

export interface MiningSuccessReport {
  reason: 'success';
  lastAttempt: MiningAttempt;
}

/**
 * @param task The mining task to use during the mining.
 * @param onAttempt This callback will be invoked after every attempt (including the very last one).
 * @param onFinish This callback will be invoked when the mining process finishes. Parameter is a report on the finish.
 * @returns an abort handle. Call it to abort the mining process.
 */
export const beginMining = (
  task: BlockchainMiningTask,
  onAttempt: MiningAttemptHandler,
  onFinish: MiningFinishHandler
): MiningAborter => {
  let isAborted = false;
  let lastAttempt: MiningAttempt | null = null;

  const canWork = () => {
    return !isAborted;
  };

  const handleAbort = () => {
    onFinish({ reason: 'aborted', lastAttempt });
  };

  const handleSuccess = () => {
    if (!hasValue(lastAttempt)) {
      throw new Error('Mining result is success but we have no lastAttempt!');
    }

    onFinish({ reason: 'success', lastAttempt });
  };

  const handleAttempt = (attempt: MiningAttempt) => {
    lastAttempt = attempt;
    onAttempt(attempt);
  };

  setImmediate(() =>
    mineLooper(
      task.blockTemplate,
      0,
      canWork,
      handleAttempt,
      handleSuccess,
      handleAbort
    )
  );

  const aborter = () => {
    isAborted = true;
  };

  return aborter;
};

const mineLooper = (
  template: BlockchainBlockTemplate,
  nonce: number,
  canWork: () => boolean,
  onAttempt: MiningAttemptHandler,
  onSuccess: () => void,
  onAbort: () => void
): void => {
  if (!canWork()) {
    onAbort();
    return;
  }

  const timestamp = Date.now();
  const attempt = attemptMine(template, nonce, timestamp);
  onAttempt(attempt);

  if (attempt.isSuccess) {
    onSuccess();
    return;
  }

  setImmediate(() =>
    mineLooper(
      template,
      safeBumpInt(nonce),
      canWork,
      onAttempt,
      onSuccess,
      onAbort
    )
  );
};

const attemptMine = (
  template: BlockchainBlockTemplate,
  nonce: number,
  timestamp: number
): MiningAttempt => {
  const header = makeBlockHeader(template, timestamp, nonce);
  const hash = hashBlock(header);
  const isSuccess = checkProofOfWork(hash, template.difficultyTarget);
  return {
    isSuccess,
    hash,
    nonce,
    timestamp,
  };
};

const makeBlockHeader = (
  template: BlockchainBlockTemplate,
  timestamp: number,
  nonce: number
): BlockchainBlockHeader => ({
  previousHash: template.previousHash,
  leadingZeroCount: template.difficultyTarget,
  timestamp,
  nonce,
});

const safeBumpInt = (num: number): number =>
  Number.isSafeInteger(num + 1) ? num + 1 : 0;
