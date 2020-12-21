import { Namespace } from 'socket.io';
import { Simulation } from './Simulation';
import { fatalAssert } from '../utils/fatalAssert';
import { logSocketEmit } from '../common/utils/socketLogUtils';
import { socketEvents } from '../common/constants/socketEvents';
import { SimulationPongPayload } from '../common/socketPayloads/SimulationPongPayload';
import { SimulationCreateNodePayload } from '../common/socketPayloads/SimulationCreateNodePayload';
import { SimulationNodeCreatedPayload } from '../common/socketPayloads/SimulationNodeCreatedPayload';
import { SimulationPingPayload } from '../common/socketPayloads/SimulationPingPayload';
import { SimulationNamespaceListener } from './SimulationSocketListener';

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
    logSocketEmit(socketEvents.simulation.pong, simulationUid, body);
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

  public readonly sendSimulationNodeCreated = (
    simulationUid: string,
    body: SimulationNodeCreatedPayload
  ) => {
    logSocketEmit(socketEvents.simulation.nodeCreated, simulationUid, body);
    const ns = this.nsMap[simulationUid];
    ns.emit(socketEvents.simulation.nodeCreated, body);
  };
}

export const simulationBridge = new SimulationBridge();
