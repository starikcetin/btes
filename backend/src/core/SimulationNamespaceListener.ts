import { Socket, Namespace } from 'socket.io';
import { simulationBridge } from './simulationBridge';
import { SimulationPingPayload } from '../common/socketPayloads/SimulationPingPayload';
import { SimulationCreateNodePayload } from '../common/socketPayloads/SimulationCreateNodePayload';
import { socketEvents } from '../common/constants/socketEvents';
import { getClientCount } from '../utils/getClientCount';
import { emitWelcome } from '../utils/emitWelcome';
import { SimulationDeleteNodePayload } from '../common/socketPayloads/SimulationDeleteNodePayload';
import { SimulationRequestSnapshotPayload } from '../common/socketPayloads/SimulationRequestStatePayload';

export class SimulationNamespaceListener {
  private readonly simulationUid: string;
  private readonly ns: Namespace;

  constructor(simulationUid: string, ns: Namespace) {
    this.simulationUid = simulationUid;
    this.ns = ns;

    ns.on(socketEvents.native.connect, (socket) => {
      this.setupSocket(socket);
    });
  }

  private readonly setupSocket = (socket: Socket) => {
    this.registerListeners(socket);
    emitWelcome(socket, this.simulationUid);
  };

  private readonly registerListeners = (socket: Socket): void => {
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
    socket.on(
      socketEvents.simulation.deleteNode,
      this.handleSimulationDeleteNode
    );
    socket.on(
      socketEvents.simulation.requestSnapshot,
      this.handleSimulationRequestSnapshot
    );
  };

  private readonly teardownSocket = (socket: Socket): void => {
    /* This would NOT work:
     *    socket.removeListener(socketEvents.simulation.ping, this.handleSimulationPing);
     * because the socketLoggerMiddleware is wrapping the listeners.
     * This would work:
     *    socket.removeAllListeners(socketEvents.simulation.ping);
     * Tarık, 2020-12-22 07:02
     */
    socket.removeAllListeners();

    const clientsLeft = getClientCount(this.ns);
    console.log(
      `${clientsLeft} clients remaining in namespace ${this.simulationUid}`
    );

    // TODO: teardown the namsepace itself when 0 clients left.
  };

  private readonly handleSimulationPing = (
    body: SimulationPingPayload
  ): void => {
    simulationBridge.handleSimulationPing(this.simulationUid, body);
  };

  private readonly handleSimulationCreateNode = (
    body: SimulationCreateNodePayload
  ) => {
    simulationBridge.handleSimulationCreateNode(this.simulationUid, body);
  };

  private readonly handleSimulationDeleteNode = (
    body: SimulationDeleteNodePayload
  ) => {
    simulationBridge.handleSimulationDeleteNode(this.simulationUid, body);
  };

  private readonly handleSimulationRequestSnapshot = (
    body: SimulationRequestSnapshotPayload
  ) => {
    simulationBridge.handleSimulationRequestSnapshot(this.simulationUid, body);
  };
}
