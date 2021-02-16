import { SimulationNodeMail } from '../../../common/SimulationNodeMail';

export interface SimulationNodeMailReceivedActionPayload {
  simulationUid: string;
  senderNodeUid: string;
  recipientNodeUid: string;
  mail: SimulationNodeMail;
}
