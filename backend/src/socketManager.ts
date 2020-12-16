import io from 'socket.io';
import http from 'http';
import { simulationBridge } from './core/simulationBridge';
import { listeners } from 'process';

class SocketManager {
  private httpServer: http.Server = http.createServer();
  private socketServer: io.Server = io(this.httpServer);

  constructor() {
    this.socketServer.on('connection', (socket) => {
      console.log(`new socket connection on root. socket id: ${socket.id}`);

      socket.emit(
        'welcome',
        `Connected to socket endpoint on root namespace with socket id: ${socket.id}`
      );
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

    ns.on('connection', (socket) => {
      console.log(
        `new socket connection on ${namespace} with socket id: ${socket.id}`
      );

      socket.on('simulation-ping', (body) => {
        console.log('received simulation-ping:', body);
        simulationBridge.handleSimulationPing(namespace, body);
      });

      socket.on(
        'simulation-create-node',
        (body: { positionX: number; positionY: number }) => {
          console.log('received simulation-create-node:', body);
          simulationBridge.handleSimulationCreateNode(namespace, body);
        }
      );

      socket.emit(
        'welcome',
        `Connected to socket endpoint on ${namespace} namespace with socket id: ${socket.id}`
      );

      if (connectionCallback) {
        connectionCallback(socket);
      }
    });

    return ns;
  }
}

export const socketManager = new SocketManager();
