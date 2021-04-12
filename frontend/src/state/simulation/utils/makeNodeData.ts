import { hasValue } from '../../../common/utils/hasValue';
import { SimulationNodeSnapshot } from '../../../common/SimulationNodeSnapshot';
import { NodeData } from '../data/NodeData';
import { makeBlockLookup } from './makeBlockLookup';
import { makeTxLookupsFromBlockTree } from './makeTxLookupsFromBlockTree';
import { makeTxLookupFromBlockArray } from './makeTxLookupFromBlockArray';
import { makeTxLookupFromTxArray } from './makeTxLookupFromTxArray';
import { Tree } from '../../../common/tree/Tree';

export const makeNodeData = (
  oldNodeData: NodeData | null,
  nodeSnapshot: SimulationNodeSnapshot
): NodeData => {
  const {
    nodeUid,
    positionX,
    positionY,
    receivedMails,
    blockchainApp,
  } = nodeSnapshot;

  const blockchainTree = Tree.fromJsonObject(blockchainApp.blockDb.blockchain);

  const {
    mainBranchTxLookup,
    sideBranchesTxLookup,
  } = makeTxLookupsFromBlockTree(blockchainTree);

  return {
    logs: oldNodeData?.logs ?? [],
    nodeUid: nodeUid,
    positionX: positionX,
    positionY: positionY,
    receivedMails: receivedMails,
    blockchainApp: {
      txDb: {
        mempool: blockchainApp.txDb.mempool,
        orphanage: blockchainApp.txDb.orphanage,
        mempoolTxLookup: makeTxLookupFromTxArray(blockchainApp.txDb.mempool),
        orphanageTxLookup: makeTxLookupFromTxArray(
          blockchainApp.txDb.orphanage
        ),
      },
      wallet: blockchainApp.wallet,
      miner: blockchainApp.miner,
      config: blockchainApp.config,
      blockDb: {
        blockchain: blockchainApp.blockDb.blockchain,
        orphanage: blockchainApp.blockDb.orphanage,
        blockchainBlockLookup: hasValue(blockchainApp.blockDb.blockchain.root)
          ? makeBlockLookup(blockchainApp.blockDb.blockchain.root)
          : {},
        mainBranchTxLookup,
        sideBranchesTxLookup,
        orphanageTxLookup: makeTxLookupFromBlockArray(
          blockchainApp.blockDb.orphanage
        ),
      },
    },
  };
};
