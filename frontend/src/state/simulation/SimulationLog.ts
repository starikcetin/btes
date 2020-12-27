import { SocketEventDirection } from './SocketEventDirection';

export interface SimulationLog {
  readonly eventName: string;
  readonly direction: SocketEventDirection;
  readonly payload: unknown;
  readonly timestamp: number;
}
