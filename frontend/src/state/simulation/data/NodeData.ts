import { SimulationNodeMail } from '../../../common/SimulationNodeMail';
import { SimulationLog } from './SimulationLog';
import { SimulationNodeBlockchainBlockSnapshot } from '../../../common/SimulationNodeBlockchainBlockSnapshot';

export interface NodeData {
  // synced state
  nodeUid: string;
  positionX: number;
  positionY: number;
  receivedMails: SimulationNodeMail[];
  blockchainBlock: SimulationNodeBlockchainBlockSnapshot;

  // local-only state
  readonly logs: SimulationLog[];
}
