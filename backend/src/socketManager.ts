import io from 'socket.io';
import http from 'http';
import { socketEvents } from './common/constants/socketEvents';
import { emitWelcome } from './utils/emitWelcome';
import { socketLoggerMiddleware } from './socketLoggerMiddleware';

class SocketManager {
  private httpServer: http.Server = http.createServer();
  private socketServer: io.Server = io(this.httpServer);

  constructor() {
    this.socketServer.use(socketLoggerMiddleware);

    this.socketServer.on(socketEvents.native.connect, (socket) => {
      console.log(`new socket connection on root. socket id: ${socket.id}`);
      emitWelcome(socket, 'root');
    });
  }

  public readonly start = (
    port: string | number,
    listeningListener?: () => void
  ) => {
    this.httpServer.listen(port, listeningListener);
  };

  public readonly getOrCreateNamespace = (namespace: string): io.Namespace => {
    const ns = this.socketServer.of(namespace);
    ns.use(socketLoggerMiddleware);
    return ns;
  };
}

export const socketManager = new SocketManager();
