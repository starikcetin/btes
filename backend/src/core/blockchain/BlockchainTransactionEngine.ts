import _ from 'lodash';

import { BlockchainTransactionEngineSnapshot } from '../../common/blockchain/BlockchainTransactionEngineSnapshot';
import { BlockchainTransaction } from '../../common/blockchain/BlockchainTransaction';
import { BlockchainTransactionInput } from '../../common/blockchain/BlockchainTransactionInput';
import { BlockchainTransactionOutPoint } from '../../common/blockchain/BlockchainTransactionOutPoint';
import { hash } from '../../utils/hash';

export type BlockchainTransactionValidity = 'invalid' | 'orphan' | 'valid';

// See BlockchainTransactionEngineSnapshot for member jsdocs.
export class BlockchainTransactionEngine {
  private readonly mempool: BlockchainTransaction[];
  private readonly orphanage: BlockchainTransaction[];

  constructor(
    mempool: BlockchainTransaction[],
    orphanage: BlockchainTransaction[]
  ) {
    this.mempool = mempool;
    this.orphanage = orphanage;
  }

  /*
   * TODO:
   *
   * 18. "Add to wallet if mine"
   *
   * 19. Relay transaction to peers
   *
   */
  public readonly receiveTx = (
    tx: BlockchainTransaction
  ): BlockchainTransactionValidity => {
    const validity = this.isTxValid(tx);

    if (validity === 'orphan') {
      this.orphanage.push(tx);
    }

    if (validity === 'valid') {
      // 17. Add to transaction pool[7]
      this.mempool.push(tx);

      // 20. For each orphan transaction that uses this one as one of its inputs, run all these steps (including this one)
      //     recursively on that orphan
      this.findOrphansReferencingTx(tx).forEach((orphan) => {
        _.remove(this.orphanage, orphan);
        this.receiveTx(orphan);
      });
    }

    return validity;
  };

  /** https://en.bitcoin.it/wiki/Protocol_rules#.22tx.22_messages */
  private readonly isTxValid = (
    tx: BlockchainTransaction
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

    const txHash = hash(tx);

    // 2. Make sure neither in or out lists are empty
    if (tx.inputs.length === 0 || tx.outputs.length === 0) {
      return 'invalid';
    }

    // 5. Make sure none of the inputs have hash=0, n=-1 (coinbase transactions)
    // > The intended purpose of this rule is to prevent relaying of coinbase transactions, since they can only exist in blocks.
    // > Instead of the check mentioned in the rule, we simply look at the `isConbase` field, which is assigned by the miner.
    if (tx.isCoinbase) {
      return 'invalid';
    }

    // 8. Reject if we already have matching tx in the pool, or in a block in the main branch
    if (this.isTxInMempool(txHash) || this.isTxInMainBranch(txHash)) {
      return 'invalid';
    }

    // 9. For each input, if the referenced output exists in any other tx in the pool, reject this transaction.[5]
    // > Clarification: https://bitcoin.stackexchange.com/questions/103342
    // > The output referenced by the input must not be referenced by another input of a transaction already in the pool.
    for (const input of tx.inputs) {
      if (this.isOutputReferencedInMempool(input)) {
        return 'invalid';
      }
    }

    // 10. For each input, look in the main branch and the transaction pool to find the referenced output transaction.
    //     If the output transaction is missing for any input, this will be an orphan transaction.
    //     Add to the orphan transactions, if a matching transaction is not in there already.
    if (this.isTxOrphan(tx)) {
      if (this.isTxInOprhanage(txHash)) {
        return 'invalid';
      } else {
        return 'orphan';
      }
    }

    // 11. For each input, if the referenced output transaction is coinbase (i.e. only 1 input, with hash=0, n=-1),
    //     it must have at least COINBASE_MATURITY (100) confirmations; else reject this transaction
    for (const input of tx.inputs) {
      const referencedTx = this.getTx(input.previousOutput.txHash);

      if (!referencedTx) {
        return 'invalid';
      }

      if (referencedTx.isCoinbase && !this.isCoinbaseMatureEnough(txHash)) {
        return 'invalid';
      }
    }

    // 12. For each input, if the referenced output does not exist (e.g. never existed or has already been spent),
    //     reject this transaction[6]
    for (const input of tx.inputs) {
      if (!this.isReferencingExistingUtxo(input.previousOutput)) {
        return 'invalid';
      }
    }

    // 14. Reject if the sum of input values < sum of output values
    const sumOfInputs = this.getSumOfInputs(tx);
    const sumOfOutputs = _.sumBy(tx.outputs, (o) => o.value);

    if (sumOfInputs < sumOfOutputs) {
      return 'invalid';
    }

    // all checks passed
    return 'valid';
  };

  private readonly getSumOfInputs = (tx: BlockchainTransaction): number => {
    // TODO: implement
    // Need blocks db to calculate sum of inputs.
    return Number.POSITIVE_INFINITY;
  };

  private readonly isCoinbaseMatureEnough = (txHash: string): boolean => {
    // TODO: implement
    return true;
  };

  /**
   * Finds the tx in the mempool or in the blockchain.
   */
  private readonly getTx = (txHash: string): BlockchainTransaction | null => {
    return this.getTxFromMempool(txHash) || this.getTxFromBlockchain(txHash);
  };

  private readonly getTxFromMempool = (
    txHash: string
  ): BlockchainTransaction | null => {
    return this.mempool.find((tx) => hash(tx) === txHash) || null;
  };

  private readonly getTxFromBlockchain = (
    txHash: string
  ): BlockchainTransaction | null => {
    // TODO: implement
    return null;
  };

  private readonly isReferencingExistingUtxo = (
    outPoint: BlockchainTransactionOutPoint
  ): boolean => {
    const { txHash, outputIndex } = outPoint;

    // TODO:
    // 1. Does the referenced output exist?

    // TODO:
    // 2. Is the referenced output unspent?

    return true;
  };

  private readonly findOrphansReferencingTx = (
    tx: BlockchainTransaction
  ): BlockchainTransaction[] => {
    const txHash = hash(tx);
    return this.orphanage.filter((orphan) =>
      orphan.inputs.some((input) => input.previousOutput.txHash === txHash)
    );
  };

  private readonly isOutputReferencedInMempool = (
    input: BlockchainTransactionInput
  ): boolean => {
    return this.mempool.some((txInMempool) =>
      txInMempool.inputs.some((inputInMempool) =>
        this.areOutPointsEquivalent(
          inputInMempool.previousOutput,
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
      outPointA.txHash === outPointB.txHash &&
      outPointA.outputIndex === outPointB.outputIndex
    );
  };

  private readonly isTxOrphan = (tx: BlockchainTransaction): boolean => {
    return tx.inputs.some(
      (input) =>
        !this.isTxInMempool(input.previousOutput.txHash) &&
        !this.isTxInMainBranch(input.previousOutput.txHash)
    );
  };

  private readonly isTxInOprhanage = (txHash: string): boolean => {
    return this.poolIncludes(this.orphanage, txHash);
  };

  private readonly isTxInMempool = (txHash: string): boolean => {
    return this.poolIncludes(this.mempool, txHash);
  };

  private readonly poolIncludes = (
    pool: BlockchainTransaction[],
    txHash: string
  ): boolean => {
    return pool.some((txInPool) => hash(txInPool) === txHash);
  };

  private readonly isTxInMainBranch = (txHash: string): boolean => {
    // TODO: implement
    return false;
  };

  public readonly takeSnapshot = (): BlockchainTransactionEngineSnapshot => {
    return {
      mempool: this.mempool,
      orphanage: this.orphanage,
    };
  };
}
