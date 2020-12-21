import { logSocketReceive } from './common/utils/socketLogUtils';
import { Socket, Namespace } from 'socket.io';
import { simulationBridge } from './core/simulationBridge';
import { SimulationPingPayload } from './common/socketPayloads/SimulationPingPayload';
import { SimulationCreateNodePayload } from './common/socketPayloads/SimulationCreateNodePayload';
import { socketEvents } from './common/constants/socketEvents';
import { getClientCount } from './utils/getClientCount';
import { emitWelcome } from './utils/emitWelcome';

export class SimulationNamespaceListener {
  private readonly simulationUid: string;
  private readonly ns: Namespace;

  constructor(simulationUid: string, ns: Namespace) {
    this.simulationUid = simulationUid;
    this.ns = ns;

    ns.on(socketEvents.native.connect, this.setupSocket);
  }

  private setupSocket = (socket: Socket) => {
    console.log(
      `new socket connection on ${this.simulationUid} with socket id: ${socket.id}`
    );

    this.registerListeners(socket);
    emitWelcome(socket, this.simulationUid);
  };

  private registerListeners = (socket: Socket): void => {
    // native events
    socket.on(
      socketEvents.native.disconnect,
      this.teardownSocket.bind(this, socket)
    );

    // simulation events
    socket.on(socketEvents.simulation.ping, this.handleSimulationPing);
    socket.on(
      socketEvents.simulation.createNode,
      this.handleSimulationCreateNode
    );
  };

  private teardownSocket = (socket: Socket): void => {
    // socket.off(socketEvents.simulation.ping, this.handleSimulationPing);
    // socket.off(socketEvents.simulation.createNode, this.handleSimulationCreateNode);

    socket.removeAllListeners();

    const clientsLeft = getClientCount(this.ns);
    console.log(
      `${clientsLeft} clients remaining in namespace ${this.simulationUid}`
    );

    // TODO: teardown the namsepace itself when 0 clients left.
  };

  private handleSimulationPing = (body: SimulationPingPayload): void => {
    logSocketReceive(socketEvents.simulation.ping, this.simulationUid, body);
    simulationBridge.handleSimulationPing(this.simulationUid, body);
  };

  private handleSimulationCreateNode = (body: SimulationCreateNodePayload) => {
    logSocketReceive(
      socketEvents.simulation.createNode,
      this.simulationUid,
      body
    );

    simulationBridge.handleSimulationCreateNode(this.simulationUid, body);
  };
}
