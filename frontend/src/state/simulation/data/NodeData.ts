import { SimulationNodeMail } from '../../../common/SimulationNodeMail';
import { SimulationLog } from './SimulationLog';
import { NodeBlockchainAppData } from './blockchain/NodeBlockchainAppData';

export interface NodeData {
  // synced state
  nodeUid: string;
  positionX: number;
  positionY: number;
  receivedMails: SimulationNodeMail[];
  blockchainApp: NodeBlockchainAppData;

  // local-only state
  readonly logs: SimulationLog[];
}
