import { hasValue } from '../../../common/utils/hasValue';
import { SimulationNodeSnapshot } from '../../../../../common/src/SimulationNodeSnapshot';
import { NodeData } from '../data/NodeData';
import { makeBlockLookup } from './makeBlockLookup';

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

  return {
    logs: oldNodeData?.logs ?? [],
    nodeUid: nodeUid,
    positionX: positionX,
    positionY: positionY,
    receivedMails: receivedMails,
    blockchainApp: {
      txDb: blockchainApp.txDb,
      wallet: blockchainApp.wallet,
      miner: blockchainApp.miner,
      config: blockchainApp.config,
      blockDb: {
        blockchain: blockchainApp.blockDb.blockchain,
        orphanage: blockchainApp.blockDb.orphanage,
        blockchainLookup: hasValue(blockchainApp.blockDb.blockchain.root)
          ? makeBlockLookup(blockchainApp.blockDb.blockchain.root)
          : {},
      },
    },
  };
};
