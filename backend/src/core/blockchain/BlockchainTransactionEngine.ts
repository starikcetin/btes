import _ from 'lodash';

import { BlockchainTransactionEngineSnapshot } from '../../common/blockchain/BlockchainTransactionEngineSnapshot';
import { BlockchainTransaction } from '../../common/blockchain/BlockchainTransaction';
import { BlockchainTransactionOutput } from '../../common/blockchain/BlockchainTransactionOutput';
import { BlockchainTransactionInput } from '../../common/blockchain/BlockchainTransactionInput';
import { BlockchainTransactionOutPoint } from '../../common/blockchain/BlockchainTransactionOutPoint';

export type BlockchainTransactionValidity = 'invalid' | 'orphan' | 'valid';

// See BlockchainTransactionEngineSnapshot for member jsdocs.
export class BlockchainTransactionEngine {
  private readonly transactionPool: BlockchainTransaction[];
  private readonly orphanTransactionsPool: BlockchainTransaction[];

  constructor(
    transactionPool: BlockchainTransaction[],
    orphanTransactionsPool: BlockchainTransaction[]
  ) {
    this.transactionPool = transactionPool;
    this.orphanTransactionsPool = orphanTransactionsPool;
  }

  public readonly receiveTransaction = (
    transaction: BlockchainTransaction
  ): BlockchainTransactionValidity => {
    const validity = this.isTransactionValid(transaction);

    if (validity === 'orphan') {
      this.orphanTransactionsPool.push(transaction);
    }

    if (validity === 'valid') {
      // 17. Add to transaction pool[7]
      this.transactionPool.push(transaction);

      // 20. For each orphan transaction that uses this one as one of its inputs, run all these steps (including this one)
      //     recursively on that orphan
      this.findOrphansReferencingTransaction(transaction).forEach((orphan) => {
        _.remove(this.orphanTransactionsPool, orphan);
        this.receiveTransaction(orphan);
      });
    }

    return validity;
  };

  /** https://en.bitcoin.it/wiki/Protocol_rules#.22tx.22_messages */
  private readonly isTransactionValid = (
    transaction: BlockchainTransaction
  ): BlockchainTransactionValidity => {
    /*
     * Won't do:
     * 1. Check syntactic correctness
     *
     * 3. Size in bytes <= MAX_BLOCK_SIZE
     *
     * 4. Each output value, as well as the total, must be in legal money range
     *
     * 6. Check that nLockTime <= INT_MAX[1], size in bytes >= 100[2], and sig opcount <= 2[3]
     *
     * 7. Reject "nonstandard" transactions: scriptSig doing anything other than pushing numbers on the stack,
     *    or scriptPubkey not matching the two usual forms[4]
     *
     * 13. Using the referenced output transactions to get input values, check that each input value,
     *     as well as the sum, are in legal money range
     *
     * 15. Reject if transaction fee (defined as sum of input values minus sum of output values) would
     *     be too low to get into an empty block
     *
     * 16. Verify the scriptPubKey accepts for each input; reject if any are bad
     */

    /*
     * TODO:
     *
     * 5. Make sure none of the inputs have hash=0, n=-1 (coinbase transactions)
     * > Did not implement coinbase tx yet.
     * > Instead of `hash=0, n=-1`, we can actually have a `isCoinbase` boolean field.
     *
     * 11. For each input, if the referenced output transaction is coinbase (i.e. only 1 input, with hash=0, n=-1),
     *     it must have at least COINBASE_MATURITY (100) confirmations; else reject this transaction
     * > Did not implement coinbase tx or blocks database yet (confirmation = blocks after).
     *
     * 12. For each input, if the referenced output does not exist (e.g. never existed or has already been spent),
     *     reject this transaction[6]
     * > Did not implement blocks database yet.
     *
     * 14. Reject if the sum of input values < sum of output values
     * > Need blocks db to calculate sum of inputs.
     *
     * 18. "Add to wallet if mine"
     *
     * 19. Relay transaction to peers
     *
     */

    // 2. Make sure neither in or out lists are empty
    if (transaction.inputs.length === 0 || transaction.outputs.length === 0) {
      return 'invalid';
    }

    // 8. Reject if we already have matching tx in the pool, or in a block in the main branch
    if (
      this.isTransactionAlreadyInPool(transaction) ||
      this.isTransactionAlreadyInBlockchainMainBranch(transaction)
    ) {
      return 'invalid';
    }

    // 9. For each input, if the referenced output exists in any other tx in the pool, reject this transaction.[5]
    // > Clarification: https://bitcoin.stackexchange.com/questions/103342
    // > The output referenced by the input must not be referenced by another input of a transaction already in the pool.
    for (const input of transaction.inputs) {
      if (this.isOutputReferencedInPool(input)) {
        return 'invalid';
      }
    }

    // 10. For each input, look in the main branch and the transaction pool to find the referenced output transaction.
    //     If the output transaction is missing for any input, this will be an orphan transaction.
    //     Add to the orphan transactions, if a matching transaction is not in there already.
    if (this.isTransactionOrphan(transaction)) {
      if (this.isTransactionAlreadyInOrphanPool(transaction)) {
        return 'invalid';
      } else {
        return 'orphan';
      }
    }

    // all checks passed
    return 'valid';
  };

  private readonly findOrphansReferencingTransaction = (
    transaction: BlockchainTransaction
  ): BlockchainTransaction[] => {
    // TODO: implement
    return [];
  };

  private readonly isOutputReferencedInPool = (
    input: BlockchainTransactionInput
  ): boolean => {
    return this.transactionPool.some((txInPool) =>
      txInPool.inputs.some((inputInPool) =>
        this.areOutPointsEquivalent(
          inputInPool.previousOutput,
          input.previousOutput
        )
      )
    );
  };

  private readonly areOutPointsEquivalent = (
    outPointA: BlockchainTransactionOutPoint,
    outPointB: BlockchainTransactionOutPoint
  ): boolean => {
    return (
      outPointA.hash === outPointB.hash && outPointA.index === outPointB.index
    );
  };

  private readonly isTransactionOrphan = (
    transaction: BlockchainTransaction
  ): boolean => {
    // TODO: implement
    return false;
  };

  private readonly isTransactionAlreadyInOrphanPool = (
    transaction: BlockchainTransaction
  ): boolean => {
    return this.poolIncludes(this.orphanTransactionsPool, transaction);
  };

  private readonly isTransactionAlreadyInPool = (
    transaction: BlockchainTransaction
  ): boolean => {
    return this.poolIncludes(this.transactionPool, transaction);
  };

  private readonly poolIncludes = (
    pool: BlockchainTransaction[],
    transaction: BlockchainTransaction
  ): boolean => {
    return pool.some((transactionInPool) =>
      this.areTransactionsEquivalent(transaction, transactionInPool)
    );
  };

  private readonly areTransactionsEquivalent = (
    a: BlockchainTransaction,
    b: BlockchainTransaction
  ): boolean => {
    return (
      _.isEmpty(_.xorWith(a.inputs, b.inputs, this.areInputsEquivalent)) &&
      _.isEmpty(_.xorWith(a.outputs, b.outputs, this.areOutputsEquivalent))
    );
  };

  private readonly isTransactionAlreadyInBlockchainMainBranch = (
    transaction: BlockchainTransaction
  ): boolean => {
    // TODO: implement
    return false;
  };

  private readonly areInputsEquivalent = (
    a: BlockchainTransactionInput,
    b: BlockchainTransactionInput
  ): boolean => {
    // TODO: implement
    return false;
  };

  private readonly areOutputsEquivalent = (
    a: BlockchainTransactionOutput,
    b: BlockchainTransactionOutput
  ): boolean => {
    // TODO: implement
    return false;
  };

  public readonly takeSnapshot = (): BlockchainTransactionEngineSnapshot => {
    return {
      transactionPool: this.transactionPool,
      orphanTransactionsPool: this.orphanTransactionsPool,
    };
  };
}
