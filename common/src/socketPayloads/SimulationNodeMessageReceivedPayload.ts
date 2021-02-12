import { SimulationNodeMessage } from '../SimulationNodeMessage';

export interface SimulationNodeMessageReceivedPayload {
  senderNodeUid: string;
  recipientNodeUid: string;
  message: SimulationNodeMessage;
}
