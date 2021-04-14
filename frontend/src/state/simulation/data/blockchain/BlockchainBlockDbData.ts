import { BlockchainBlock } from '../../../../common/blockchain/block/BlockchainBlock';
import { TreeJsonObject } from '../../../../common/tree/TreeJsonObject';
import { BlockLookup } from './BlockLookup';
import { TxLookup } from './TxLookup';

export interface BlockchainBlockDbData {
  // synced state
  readonly blockchain: TreeJsonObject<BlockchainBlock>;
  readonly orphanage: BlockchainBlock[];

  // derived state
  readonly blockchainBlockLookup: BlockLookup;
  readonly mainBranchTxLookup: TxLookup;
  readonly sideBranchesTxLookup: TxLookup;
  readonly orphanageTxLookup: TxLookup;
  readonly mainBranchHeadHash: string | null;
}
