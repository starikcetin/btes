import { Socket } from 'socket.io';
import { socketEvents } from '../common/constants/socketEvents';
import { SimulationWelcomePayload } from '../common/socketPayloads/SimulationWelcomePayload';

/**
 * Emits a welcome event.
 * @param socket Event will be emitted to this socket.
 * @param namespace From which namespace are we welcoming?
 */
export const emitWelcome = (socket: Socket, namespace: string): void => {
  const body: SimulationWelcomePayload = {
    message: `Connected to socket endpoint on ${namespace} namespace with socket id: ${socket.id}`,
  };

  socket.emit(socketEvents.simulation.welcome, body);
};
