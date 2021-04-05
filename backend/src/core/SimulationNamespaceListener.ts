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
import { BlockchainSaveKeyPairCommand } from './commands/BlockchainSaveKeyPairCommand';
import { SimulationConnectNodesPayload } from '../common/socketPayloads/SimulationConnectNodesPayload';
import { SimulationDisconnectNodesPayload } from '../common/socketPayloads/SimulationDisconnectNodesPayload';
import { SimulationConnectNodesCommand } from './commands/SimulationConnectNodesCommand';
import { SimulationDisconnectNodesCommand } from './commands/SimulationDisconnectNodesCommand';
import { SimulationNamespaceEmitter } from './SimulationNamespaceEmitter';
import { NodeConnectionMap } from './network/NodeConnectionMap';
import { ControlledTimerService } from './network/ControlledTimerService';
import { SimulationChangeTimeScalePayload } from '../common/socketPayloads/SimulationChangeTimeScalePayload';
import { SimulationConnectionChangeLatencyPayload } from '../common/socketPayloads/SimulationConnectionChangeLatencyPayload';
import { SimulationConnectionChangeLatencyCommand } from './commands/SimulationConnectionChangeLatencyCommand';
import { BlockchainSaveKeyPairPayload } from '../common/socketPayloads/BlockchainSaveKeyPairPayload';
import { BlockchainStartMiningPayload } from '../common/socketPayloads/BlockchainStartMiningPayload';
import { BlockchainStartMiningCommand } from './commands/BlockchainStartMiningCommand';
import { BlockchainAbortMiningPayload } from '../common/socketPayloads/BlockchainAbortMiningPayload';
import { BlockchainAbortMiningCommand } from './commands/BlockchainAbortMiningCommand';
import { BlockchainBroadcastMinedBlockPayload } from '../common/socketPayloads/BlockchainBroadcastMinedBlockPayload';
import { BlockchainDismissMiningPayload } from '../common/socketPayloads/BlockchainDismissMiningPayload';
import { BlockchainBroadcastMinedBlockCommand } from './commands/BlockchainBroadcastMinedBlockCommand';
import { BlockchainDismissMiningCommand } from './commands/BlockchainDismissMiningCommand';
import { BlockchainBroadcastTxPayload } from '../common/socketPayloads/BlockchainBroadcastTxPayload';
import { BlockchainBroadcastTxCommand } from './commands/BlockchainBroadcastTxCommand';

export class SimulationNamespaceListener {
  private readonly simulation: Simulation;
  private readonly ns: Namespace;
  private readonly commandHistoryManager: CommandHistoryManager;
  private readonly connectionMap: NodeConnectionMap;
  private readonly timerService: ControlledTimerService;
  private readonly socketEmitter: SimulationNamespaceEmitter;

  constructor(
    simulation: Simulation,
    ns: Namespace,
    commandHistoryManager: CommandHistoryManager,
    connectionMap: NodeConnectionMap,
    timerService: ControlledTimerService,
    socketEmitter: SimulationNamespaceEmitter
  ) {
    this.simulation = simulation;
    this.ns = ns;
    this.commandHistoryManager = commandHistoryManager;
    this.connectionMap = connectionMap;
    this.timerService = timerService;
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
    socket.on(socketEvents.simulation.pause, this.handleSimulationPause);
    socket.on(socketEvents.simulation.resume, this.handleSimulationResume);
    socket.on(
      socketEvents.simulation.changeTimeScale,
      this.handleSimulationChangeTimeScale
    );
    socket.on(
      socketEvents.simulation.connectionChangeLatency,
      this.handleConnectionChangeLatency
    );
    socket.on(
      socketEvents.simulation.blockchainSaveKeyPair,
      this.handleBlockchainSaveKeyPair
    );
    socket.on(
      socketEvents.simulation.blockchainStartMining,
      this.handleBlockchainStartMining
    );
    socket.on(
      socketEvents.simulation.blockchainAbortMining,
      this.handleBlockchainAbortMining
    );
    socket.on(
      socketEvents.simulation.blockchainDismissMining,
      this.handleBlockchainDismissMining
    );
    socket.on(
      socketEvents.simulation.blockchainBroadcastMinedBlock,
      this.handleBlockchainBroadcastMinedBlock
    );
    socket.on(
      socketEvents.simulation.blockchainBroadcastTx,
      this.handleBlockchainBroadcastTx
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

    this.commandHistoryManager.register(createCommand);
    createCommand.execute();
  };

  private readonly handleSimulationDeleteNode = (
    body: SimulationDeleteNodePayload
  ) => {
    const createCommand = new SimulationDeleteNodeCommand(
      this.simulation,
      this.connectionMap,
      body
    );

    this.commandHistoryManager.register(createCommand);
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

    this.commandHistoryManager.register(createCommand);
    createCommand.execute();
  };

  private readonly handleSimulationUndo = () => {
    this.commandHistoryManager.undo();
  };

  private readonly handleSimulationRedo = () => {
    this.commandHistoryManager.redo();
  };

  private readonly handleSimulationNodeBroadcastMail = (
    body: SimulationNodeBroadcastMailPayload
  ) => {
    const command = new SimulationNodeBroadcastMailCommand(
      this.simulation,
      body
    );

    command.execute();
  };

  private readonly handleSimulationNodeUnicastMail = (
    body: SimulationNodeUnicastMailPayload
  ) => {
    const command = new SimulationNodeUnicastMailCommand(this.simulation, body);
    command.execute();
  };

  private readonly handleSimulationConnectNodes = (
    body: SimulationConnectNodesPayload
  ) => {
    const createCommand = new SimulationConnectNodesCommand(
      this.simulation,
      body
    );

    this.commandHistoryManager.register(createCommand);
    createCommand.execute();
  };

  private readonly handleSimulationDisconnectNodes = (
    body: SimulationDisconnectNodesPayload
  ) => {
    const createCommand = new SimulationDisconnectNodesCommand(
      this.simulation,
      body
    );

    this.commandHistoryManager.register(createCommand);
    createCommand.execute();
  };

  private readonly handleSimulationPause = () => {
    this.timerService.pause();
  };

  private readonly handleSimulationResume = () => {
    this.timerService.resume();
  };

  private readonly handleSimulationChangeTimeScale = (
    body: SimulationChangeTimeScalePayload
  ) => {
    this.timerService.setTimeScale(body.timeScale);
  };

  private readonly handleConnectionChangeLatency = (
    body: SimulationConnectionChangeLatencyPayload
  ) => {
    const command = new SimulationConnectionChangeLatencyCommand(
      this.connectionMap,
      body
    );

    this.commandHistoryManager.register(command);
    command.execute();
  };

  private readonly handleBlockchainSaveKeyPair = (
    body: BlockchainSaveKeyPairPayload
  ) => {
    const command = new BlockchainSaveKeyPairCommand(this.simulation, body);
    command.execute();
  };

  private readonly handleBlockchainStartMining = (
    body: BlockchainStartMiningPayload
  ) => {
    const command = new BlockchainStartMiningCommand(this.simulation, body);
    command.execute();
  };

  private readonly handleBlockchainAbortMining = (
    body: BlockchainAbortMiningPayload
  ) => {
    const command = new BlockchainAbortMiningCommand(this.simulation, body);
    command.execute();
  };

  private readonly handleBlockchainBroadcastMinedBlock = (
    body: BlockchainBroadcastMinedBlockPayload
  ) => {
    const command = new BlockchainBroadcastMinedBlockCommand(
      this.simulation,
      body
    );
    command.execute();
  };

  private readonly handleBlockchainBroadcastTx = (
    body: BlockchainBroadcastTxPayload
  ) => {
    const command = new BlockchainBroadcastTxCommand(this.simulation, body);
    command.execute();
  };

  private readonly handleBlockchainDismissMining = (
    body: BlockchainDismissMiningPayload
  ) => {
    const command = new BlockchainDismissMiningCommand(this.simulation, body);
    command.execute();
  };
}
