import { Namespace } from 'socket.io';
import { Simulation } from './Simulation';
import { fatalAssert } from '../utils/fatalAssert';
import { socketEvents } from '../common/constants/socketEvents';
import { SimulationPongPayload } from '../common/socketPayloads/SimulationPongPayload';
import { SimulationCreateNodePayload } from '../common/socketPayloads/SimulationCreateNodePayload';
import { SimulationNodeCreatedPayload } from '../common/socketPayloads/SimulationNodeCreatedPayload';
import { SimulationPingPayload } from '../common/socketPayloads/SimulationPingPayload';
import { SimulationNamespaceListener } from './SimulationNamespaceListener';
import { SimulationDeleteNodePayload } from '../common/socketPayloads/SimulationDeleteNodePayload';
import { SimulationNodeDeletedPayload } from '../common/socketPayloads/SimulationNodeDeletedPayload';
import { SimulationRequestSnapshotPayload } from '../common/socketPayloads/SimulationRequestStatePayload';
import { SimulationSnapshotReportPayload } from '../common/socketPayloads/SimulationSnapshotReportPayload';
import { SimulationUpdateNodePositionPayload } from '../common/socketPayloads/SimulationUpdateNodePositionPayload';
import { SimulationNodePositionUpdatedPayload } from '../common/socketPayloads/SimulationNodePositionUpdatedPayload';

class SimulationBridge {
  private readonly simulationMap: { [simulationUid: string]: Simulation } = {};
  private readonly nsMap: { [simulationUid: string]: Namespace } = {};

  private readonly listenerMap: {
    [simulaitonUid: string]: SimulationNamespaceListener;
  } = {};

  public readonly setupNewSimulation = (
    simulationUid: string,
    ns: Namespace
  ) => {
    const newSimulation = new Simulation(simulationUid);
    const listener = new SimulationNamespaceListener(simulationUid, ns);

    this.simulationMap[simulationUid] = newSimulation;
    this.nsMap[simulationUid] = ns;
    this.listenerMap[simulationUid] = listener;
  };

  public readonly checkSimulationExists = (simulationUid: string): boolean => {
    const simulationExists = !!this.simulationMap[simulationUid];
    const namespaceExists = !!this.nsMap[simulationUid];

    fatalAssert(
      simulationExists === namespaceExists,
      `Desync between simulation map and namespace map! simulationUid: ${simulationUid}, simulationExists: ${simulationExists}, namespaceExists: ${namespaceExists}`
    );

    return simulationExists;
  };

  public readonly handleSimulationPing = (
    simulationUid: string,
    body: SimulationPingPayload
  ) => {
    const simulation = this.simulationMap[simulationUid];
    simulation.handleSimulationPing(body);
  };

  public readonly sendSimulationPong = (
    simulationUid: string,
    body: SimulationPongPayload
  ) => {
    const ns = this.nsMap[simulationUid];
    ns.emit(socketEvents.simulation.pong, body);
  };

  public readonly handleSimulationCreateNode = (
    simulaitonUid: string,
    body: SimulationCreateNodePayload
  ) => {
    const simulation = this.simulationMap[simulaitonUid];
    simulation.handleSimulationCreateNode(body);
  };

  public readonly handleSimulationUpdateNodePosition = (
    simulaitonUid: string,
    body: SimulationUpdateNodePositionPayload
  ) => {
    const simulation = this.simulationMap[simulaitonUid];
    simulation.handleSimulationUpdateNodePosition(body);
  };

  public readonly sendSimulationNodeCreated = (
    simulationUid: string,
    body: SimulationNodeCreatedPayload
  ) => {
    const ns = this.nsMap[simulationUid];
    ns.emit(socketEvents.simulation.nodeCreated, body);
  };

  public readonly handleSimulationDeleteNode = (
    simulationUid: string,
    body: SimulationDeleteNodePayload
  ) => {
    const simulation = this.simulationMap[simulationUid];
    simulation.handleSimulationDeleteNode(body);
  };

  public readonly sendSimulationNodeDeleted = (
    simulationUid: string,
    body: SimulationNodeDeletedPayload
  ) => {
    const ns = this.nsMap[simulationUid];
    ns.emit(socketEvents.simulation.nodeDeleted, body);
  };

  public readonly handleSimulationRequestSnapshot = (
    simulationUid: string,
    body: SimulationRequestSnapshotPayload
  ) => {
    const simulation = this.simulationMap[simulationUid];
    simulation.handleSimulationRequestSnapshot(body);
  };

  public readonly sendSimulationSnapshotReport = (
    simulationUid: string,
    body: SimulationSnapshotReportPayload
  ): void => {
    const ns = this.nsMap[simulationUid];
    ns.emit(socketEvents.simulation.snapshotReport, body);
  };

  public readonly sendSimulationNodePositionUpdated = (
    simulationUid: string,
    body: SimulationNodePositionUpdatedPayload
  ) => {
    const ns = this.nsMap[simulationUid];
    ns.emit(socketEvents.simulation.nodePositionUpdated, body);
  };
}

export const simulationBridge = new SimulationBridge();
