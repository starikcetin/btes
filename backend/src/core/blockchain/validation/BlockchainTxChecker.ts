import { BlockchainRegularTx } from '../../../common/blockchain/BlockchainTx';
import { BlockchainCommonChecker } from './BlockchainCommonChecker';

export class BlockchainTxChecker {
  private readonly commonChecker: BlockchainCommonChecker;

  constructor(commonChecker: BlockchainCommonChecker) {
    this.commonChecker = commonChecker;
  }

  public readonly checkTxForReceiveTx = (
    tx: BlockchainRegularTx
  ): 'invalid' | 'orphan' | 'valid' => {
    // CheckTxContextFree (canSearchMainBranchForDupes = true)
    const contextFreeCheck = this.commonChecker.checkTxContextFree(tx, {
      canSearchMainBranchForDupes: true,
    });

    if (contextFreeCheck === 'invalid') {
      return 'invalid';
    }

    // CheckTxForReceive (canSearchMempoolForOutput = true)
    const forReceiveCheck = this.commonChecker.checkTxForReceive(tx, {
      canSearchMempoolForOutput: true,
    });

    return forReceiveCheck.checkResult;
  };
}
