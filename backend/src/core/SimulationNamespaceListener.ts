import { Socket, Namespace } from 'socket.io';
import { SimulationPingPayload } from '../common/socketPayloads/SimulationPingPayload';
import { SimulationCreateNodePayload } from '../common/socketPayloads/SimulationCreateNodePayload';
import { socketEvents } from '../common/constants/socketEvents';
import { getClientCount } from '../utils/getClientCount';
import { emitWelcome } from '../utils/emitWelcome';
import { SimulationDeleteNodePayload } from '../common/socketPayloads/SimulationDeleteNodePayload';
import { SimulationRequestSnapshotPayload } from '../common/socketPayloads/SimulationRequestStatePayload';
import { SimulationUpdateNodePositionPayload } from '../common/socketPayloads/SimulationUpdateNodePositionPayload';
import { Simulation } from './Simulation';
import { CommandHistoryManager } from './undoRedo/CommandHistoryManager';
import { SimulationCreateNodeCommand } from './commands/SimulationCreateNodeCommand';
import { SimulationDeleteNodeCommand } from './commands/SimulationDeleteNodeCommand';
import { SimulationUpdateNodePositionCommand } from './commands/SimulationUpdateNodePositionCommand';
import { SimulationNodeBroadcastMailPayload } from '../common/socketPayloads/SimulationNodeBroadcastMailPayload';
import { SimulationNodeBroadcastMailCommand } from './commands/SimulationNodeBroadcastMailCommand';
import { SimulationNodeUnicastMailPayload } from '../common/socketPayloads/SimulationNodeUnicastMailPayload';
import { SimulationNodeUnicastMailCommand } from './commands/SimulationNodeUnicastMailCommand';
import { SimulationConnectNodesPayload } from '../common/socketPayloads/SimulationConnectNodesPayload';
import { SimulationDisconnectNodesPayload } from '../common/socketPayloads/SimulationDisconnectNodesPayload';
import { SimulationConnectNodesCommand } from './commands/SimulationConnectNodesCommand';
import { SimulationDisconnectNodesCommand } from './commands/SimulationDisconnectNodesCommand';
import { SimulationNamespaceEmitter } from './SimulationNamespaceEmitter';

export class SimulationNamespaceListener {
  private readonly simulation: Simulation;
  private readonly ns: Namespace;
  private readonly actionHistoryKeeper: CommandHistoryManager;
  private readonly socketEmitter: SimulationNamespaceEmitter;

  constructor(
    simulation: Simulation,
    ns: Namespace,
    actionHistoryKeeper: CommandHistoryManager,
    socketEmitter: SimulationNamespaceEmitter
  ) {
    this.simulation = simulation;
    this.ns = ns;
    this.actionHistoryKeeper = actionHistoryKeeper;
    this.socketEmitter = socketEmitter;

    ns.on(socketEvents.native.connect, (socket) => {
      this.setupSocket(socket);
    });
  }

  private readonly setupSocket = (socket: Socket) => {
    this.registerListeners(socket);
    emitWelcome(socket, this.simulation.simulationUid);
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
    socket.on(
      socketEvents.simulation.updateNodePosition,
      this.handleSimulationUpdateNodePosition
    );
    socket.on(socketEvents.simulation.undo, this.handleSimulationUndo);
    socket.on(socketEvents.simulation.redo, this.handleSimulationRedo);
    socket.on(
      socketEvents.simulation.nodeBroadcastMail,
      this.handleSimulationNodeBroadcastMail
    );
    socket.on(
      socketEvents.simulation.nodeUnicastMail,
      this.handleSimulationNodeUnicastMail
    );
    socket.on(
      socketEvents.simulation.connectNodes,
      this.handleSimulationConnectNodes
    );
    socket.on(
      socketEvents.simulation.disconnectNodes,
      this.handleSimulationDisconnectNodes
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
      `${clientsLeft} clients remaining in namespace ${this.simulation.simulationUid}`
    );

    // TODO: teardown the namsepace itself when 0 clients left.
  };

  private readonly handleSimulationPing = (body: SimulationPingPayload) => {
    this.socketEmitter.sendSimulationPong({
      pingDate: body.date,
      pongDate: Date.now(),
    });
  };

  private readonly handleSimulationCreateNode = (
    body: SimulationCreateNodePayload
  ) => {
    const createCommand = new SimulationCreateNodeCommand(
      this.simulation,
      body
    );

    this.actionHistoryKeeper.register(createCommand);
    createCommand.execute();
  };

  private readonly handleSimulationDeleteNode = (
    body: SimulationDeleteNodePayload
  ) => {
    const createCommand = new SimulationDeleteNodeCommand(
      this.simulation,
      body
    );

    this.actionHistoryKeeper.register(createCommand);
    createCommand.execute();
  };

  private readonly handleSimulationRequestSnapshot = (
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    body: SimulationRequestSnapshotPayload
  ) => {
    const snapshot = this.simulation.takeSnapshot();
    this.socketEmitter.sendSimulationSnapshotReport({ snapshot });
  };

  private readonly handleSimulationUpdateNodePosition = (
    body: SimulationUpdateNodePositionPayload
  ) => {
    const createCommand = new SimulationUpdateNodePositionCommand(
      this.simulation,
      body
    );

    this.actionHistoryKeeper.register(createCommand);
    createCommand.execute();
  };

  private readonly handleSimulationUndo = () => {
    this.actionHistoryKeeper.undo();
  };

  private readonly handleSimulationRedo = () => {
    this.actionHistoryKeeper.redo();
  };

  private readonly handleSimulationNodeBroadcastMail = (
    body: SimulationNodeBroadcastMailPayload
  ) => {
    const command = new SimulationNodeBroadcastMailCommand(
      this.simulation,
      this.socketEmitter,
      body
    );

    command.execute();
  };

  private readonly handleSimulationNodeUnicastMail = (
    body: SimulationNodeUnicastMailPayload
  ) => {
    const command = new SimulationNodeUnicastMailCommand(
      this.simulation,
      this.socketEmitter,
      body
    );

    command.execute();
  };

  private readonly handleSimulationConnectNodes = (
    body: SimulationConnectNodesPayload
  ) => {
    const createCommand = new SimulationConnectNodesCommand(
      this.simulation,
      body
    );

    this.actionHistoryKeeper.register(createCommand);
    createCommand.execute();
  };

  private readonly handleSimulationDisconnectNodes = (
    body: SimulationDisconnectNodesPayload
  ) => {
    const createCommand = new SimulationDisconnectNodesCommand(
      this.simulation,
      body
    );

    this.actionHistoryKeeper.register(createCommand);
    createCommand.execute();
  };
}
