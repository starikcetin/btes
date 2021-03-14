import { BlockchainTransaction } from '../../../common/blockchain/BlockchainTransaction';
import { BlockchainCommonChecker } from './BlockchainCommonChecker';

export class BlockchainTxChecker {
  private readonly commonChecker: BlockchainCommonChecker;

  constructor(commonChecker: BlockchainCommonChecker) {
    this.commonChecker = commonChecker;
  }

  public readonly checkTxForReceiveTx = (
    tx: BlockchainTransaction
  ): 'invalid' | 'orphan' | 'valid' => {
    // CheckTxContextFree (canSearchMainBranchForDupes = true)
    const ctcf = this.commonChecker.checkTxContextFree(tx, {
      canSearchMainBranchForDupes: true,
    });

    if (ctcf === 'invalid') {
      return 'invalid';
    }

    // CheckTxForReceive (canSearchMempoolForOutput = true)
    const ctfr = this.commonChecker.checkTxForReceive(tx, {
      canSearchMempoolForOutput: true,
    });

    return ctfr.checkResult;
  };
}
