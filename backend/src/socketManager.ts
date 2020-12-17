import io from 'socket.io';
import http from 'http';
import { SimulationWelcomePayload } from './common/socketPayloads/SimulationWelcomePayload';
import { SimulationSocketListener } from './SimulationSocketListener';
import { socketEvents } from './common/constants/socketEvents';

class SocketManager {
  private httpServer: http.Server = http.createServer();
  private socketServer: io.Server = io(this.httpServer);

  private readonly uidToSocketListenerMap: {
    [uid: string]: SimulationSocketListener;
  } = {};

  constructor() {
    this.socketServer.on(socketEvents.native.connect, (socket) => {
      console.log(`new socket connection on root. socket id: ${socket.id}`);

      this.emitWelcome(socket, {
        message: `Connected to socket endpoint on root namespace with socket id: ${socket.id}`,
      });
    });
  }

  public start(port: string | number, listeningListener?: () => void) {
    this.httpServer.listen(port, listeningListener);
  }

  public getOrCreateNamespace(
    namespace: string,
    connectionCallback?: (socket: io.Socket) => void
  ): io.Namespace {
    const ns = this.socketServer.of(namespace);

    ns.on(socketEvents.native.connect, (socket) => {
      console.log(
        `new socket connection on ${namespace} with socket id: ${socket.id}`
      );

      const listener = new SimulationSocketListener(namespace, socket);
      this.uidToSocketListenerMap[namespace] = listener;

      this.emitWelcome(socket, {
        message: `Connected to socket endpoint on ${namespace} namespace with socket id: ${socket.id}`,
      });

      if (connectionCallback) {
        connectionCallback(socket);
      }
    });

    return ns;
  }

  private emitWelcome(socket: io.Socket, body: SimulationWelcomePayload) {
    socket.emit(socketEvents.simulation.welcome, body);
  }
}

export const socketManager = new SocketManager();
