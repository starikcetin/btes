import { beginMining, MiningFinishReport } from './beginMining';
import { BlockchainMiningTask } from '../../../../common/blockchain/miner/BlockchainMiningTask';
import { BlockchainBlockHeader } from '../../../../common/blockchain/block/BlockchainBlockHeader';
import { hashBlock } from '../../../../common/blockchain/utils/hashBlock';
import { MiningAttempt } from '../../../../common/blockchain/miner/MiningAttempt';
import { checkProofOfWork } from '../../utils/checkProofOfWork';

it('mines correctly', (done) => {
  const task: BlockchainMiningTask = {
    blockTemplate: {
      coinbase: 'barbaz',
      previousHash: 'foobar',
      recipientAddress: 'quax',
      value: 3427,
      difficultyTarget: 2,
    },
  };

  const attemptHandler = (attempt: MiningAttempt): void => {
    const header: BlockchainBlockHeader = {
      previousHash: task.blockTemplate.previousHash,
      timestamp: attempt.timestamp,
      leadingZeroCount: task.blockTemplate.difficultyTarget,
      nonce: attempt.nonce,
    };

    const hash = hashBlock(header);

    expect(attempt.hash).toBe(hash);
    expect(attempt.isSuccess).toBe(
      checkProofOfWork(hash, task.blockTemplate.difficultyTarget)
    );
  };

  const stopHandler = (report: MiningFinishReport): void => {
    if (report.reason !== 'success') {
      throw new Error('Mining last result is not successful');
    }

    const header: BlockchainBlockHeader = {
      previousHash: task.blockTemplate.previousHash,
      timestamp: report.lastAttempt.timestamp,
      leadingZeroCount: task.blockTemplate.difficultyTarget,
      nonce: report.lastAttempt.nonce,
    };

    const hash = hashBlock(header);

    expect(report.lastAttempt.hash).toBe(hash);
    expect(report.lastAttempt.isSuccess).toBeTrue();
    expect(
      checkProofOfWork(hash, task.blockTemplate.difficultyTarget)
    ).toBeTrue();

    done();
  };

  beginMining(task, attemptHandler, stopHandler);
}, 600000);
