import _ from 'lodash';

import { BlockchainBlock } from '../../../common/blockchain/BlockchainBlock';
import { BlockchainTransaction } from '../../../common/blockchain/BlockchainTransaction';
import { TreeNode } from '../../../common/tree/TreeNode';
import { hash } from '../../../utils/hash';
import { verifyScripts } from '../utils/verifyScripts';
import { BlockchainConfig } from '../../../common/blockchain/BlockchainConfig';
import { BlockchainBlockDatabase } from '../modules/BlockchainBlockDatabase';
import { BlockchainTransactionDatabase } from '../modules/BlockchainTransactionDatabase';

type TxLookupResult = {
  tx: BlockchainTransaction;
  block: BlockchainBlock | null;
  node: TreeNode<BlockchainBlock> | null;
} | null;

export type CheckTxForReceiveResult =
  | { checkResult: 'valid'; sumOfInputs: number; sumOfOutputs: number }
  | { checkResult: 'orphan' | 'invalid' };

export class BlockchainCommonChecker {
  private readonly config: BlockchainConfig;
  private readonly blockDatabase: BlockchainBlockDatabase;
  private readonly transactionDatabase: BlockchainTransactionDatabase;

  constructor(
    config: BlockchainConfig,
    blockDatabase: BlockchainBlockDatabase,
    transactionDatabase: BlockchainTransactionDatabase
  ) {
    this.config = config;
    this.blockDatabase = blockDatabase;
    this.transactionDatabase = transactionDatabase;
  }

  /** `sumOfInputs` and `sumOfOutputs` will be `-1` if `checkResult` is not `valid` */
  public readonly checkTxForReceive = (
    tx: BlockchainTransaction,
    options: {
      canSearchMempoolForOutput: boolean;
    }
  ): CheckTxForReceiveResult => {
    const { canSearchMempoolForOutput } = options;

    let sumOfInputs = 0;

    for (const input of tx.inputs) {
      const { previousOutput, unlockingScript } = input;

      // tx10. & bc16.1.1. For each input, look in the main branch (if canSearchMempoolForOutput: also look in the transaction pool) to find the referenced output transaction. If the output transaction is missing for any input, this will be an orphan transaction...
      const refOutputLookup = this.checkTxForReceive_txLookup(
        previousOutput.txHash,
        canSearchMempoolForOutput
      );

      if (refOutputLookup === null) {
        return { checkResult: 'orphan' };
      }

      const { tx: refOutputTx, node: refOutputNode } = refOutputLookup;

      // bc16.1.2. For each input, if we are using the nth output of the earlier transaction, but it has fewer than n+1 outputs, reject.
      if (refOutputTx.outputs.length < previousOutput.outputIndex + 1) {
        return { checkResult: 'invalid' };
      }

      const refOutput = refOutputTx.outputs[previousOutput.outputIndex];
      sumOfInputs += refOutput.value;

      // tx11. & bc16.1.3. For each input, if the referenced output transaction is coinbase, it must have at least COINBASE_MATURITY confirmations; else reject this transaction
      if (refOutputTx.isCoinbase) {
        if (refOutputNode === null) {
          throw new Error(
            'refOutputTx is coinbase, but refOutputNode is null!'
          );
        }

        if (refOutputNode.depth < this.config.coinbaseMaturity) {
          return { checkResult: 'invalid' };
        }
      }

      // tx12. & bc16.1.5. For each input, if the referenced output does not exist (e.g. never existed or has already been spent), reject this transaction[6]
      // > existence is checked by tx10 and bc16.1.2 rules. we only need to check if it was spent before.
      if (this.blockDatabase.isOutPointInMainBranch(previousOutput)) {
        return { checkResult: 'invalid' };
      }

      // tx16. & bc16.1.4. Verify the scriptPubKey accepts for each input; reject if any are bad
      if (!verifyScripts(refOutput.lockingScript, unlockingScript)) {
        return { checkResult: 'invalid' };
      }
    }

    const sumOfOutputs = _.sumBy(tx.outputs, (o) => o.value);
    // tx14. & bc16.1.7. Reject if the sum of input values < sum of output values
    if (sumOfInputs < sumOfOutputs) {
      return { checkResult: 'invalid' };
    }

    return { checkResult: 'valid', sumOfInputs, sumOfOutputs };
  };

  public readonly checkTxContextFree = (
    tx: BlockchainTransaction,
    options: {
      canSearchMainBranchForDupes: boolean;
    }
  ): 'invalid' | 'valid' => {
    const { canSearchMainBranchForDupes } = options;
    const txHash = hash(tx);

    // tx2. Make sure neither in or out lists are empty
    if (tx.inputs.length === 0 || tx.outputs.length === 0) {
      return 'invalid';
    }

    // tx5. Make sure none of the inputs have hash=0, n=-1 (coinbase transactions)
    // > The intended purpose of this rule is to prevent relaying of coinbase transactions, since they can only exist in blocks.
    // > Instead of the check mentioned in the rule, we simply look at the `isConbase` field, which is assigned by the miner.
    if (tx.isCoinbase) {
      return 'invalid';
    }

    // tx8. Reject if we already have matching tx in the pool...
    if (this.transactionDatabase.isTxInMempool(txHash)) {
      return 'invalid';
    }

    // if canSearchMainBranchForDupes:
    //   tx8... or in a block in the main branch
    if (
      canSearchMainBranchForDupes &&
      this.blockDatabase.isTxInMainBranch(txHash)
    ) {
      return 'invalid';
    }

    // tx9. For each input, if the referenced output exists in any other tx in the pool, reject this transaction.[5]
    // > Clarification: https://bitcoin.stackexchange.com/questions/103342
    // > The output referenced by the input must not be referenced by another input of a transaction already in the pool.
    for (const input of tx.inputs) {
      if (this.transactionDatabase.isOutPointInMempool(input.previousOutput)) {
        return 'invalid';
      }
    }

    return 'valid';
  };

  private readonly checkTxForReceive_txLookup = (
    txHash: string,
    canSearchMempool: boolean
  ): TxLookupResult => {
    const lookupFromMainBranch = this.blockDatabase.findTxInMainBranch(txHash);

    if (lookupFromMainBranch !== null) {
      return lookupFromMainBranch;
    }

    if (canSearchMempool) {
      const lookupFromMempool = this.transactionDatabase.findTxInMempool(
        txHash
      );

      if (lookupFromMempool !== null) {
        return {
          block: null,
          node: null,
          tx: lookupFromMempool,
        };
      }
    }

    return null;
  };
}
