import { SocketEventDirection } from '../data/SocketEventDirection';

export interface SimulationLogNodeActionPayload {
  readonly simulationUid: string;
  readonly nodeUid: string;
  readonly direction: SocketEventDirection;
  readonly eventName: string;
  readonly payload: unknown;
  readonly timestamp: number;
}
