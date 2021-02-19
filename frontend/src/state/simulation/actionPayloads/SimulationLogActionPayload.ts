import { SocketEventDirection } from '../data/SocketEventDirection';

export interface SimulationLogActionPayload {
  readonly simulationUid: string;
  readonly direction: SocketEventDirection;
  readonly eventName: string;
  readonly payload: unknown;
  readonly timestamp: number;
}
