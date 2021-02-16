import { SimulationNodeMail } from '../../../common/SimulationNodeMail';
import { SimulationLog } from './SimulationLog';

export interface NodeData {
  // synced state
  nodeUid: string;
  positionX: number;
  positionY: number;
  connectedNodeUids: string[];
  receivedMails: SimulationNodeMail[];

  // local-only state
  readonly logs: SimulationLog[];
}
