import { SimulationNodeMail } from '../SimulationNodeMail';

export interface SimulationNodeMailSentPayload {
  senderNodeUid: string;
  recipientNodeUid: string;
  mail: SimulationNodeMail;
}
