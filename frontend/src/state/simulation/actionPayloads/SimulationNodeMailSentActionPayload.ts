import { SimulationNodeMail } from '../../../common/SimulationNodeMail';

export interface SimulationNodeMailSentActionPayload {
  simulationUid: string;
  senderNodeUid: string;
  recipientNodeUid: string;
  mail: SimulationNodeMail;
}
