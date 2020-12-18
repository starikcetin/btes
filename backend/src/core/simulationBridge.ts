import { Namespace } from 'socket.io';
import { Simulation } from './Simulation';
import { fatalAssert } from '../utils/fatalAssert';
import { logSocketEmit } from '../common/utils/socketLogUtils';
import { socketEvents } from '../common/constants/socketEvents';
import { SimulationPongPayload } from '../common/socketPayloads/SimulationPongPayload';
import { SimulationCreateNodePayload } from '../common/socketPayloads/SimulationCreateNodePayload';
import { SimulationNodeCreatedPayload } from '../common/socketPayloads/SimulationNodeCreatedPayload';
import { SimulationPingPayload } from '../common/socketPayloads/SimulationPingPayload';

class SimulationBridge {
  private simulationMap: { [simulationUid: string]: Simulation } = {};
  private nsMap: { [simulationUid: string]: Namespace } = {};

  public createSimulation(simulationUid: string, ns: Namespace) {
    const newSimulation = new Simulation(simulationUid);
    this.simulationMap[simulationUid] = newSimulation;
    this.nsMap[simulationUid] = ns;
  }

  public checkSimulationExists(simulationUid: string): boolean {
    const simulationExists = !!this.simulationMap[simulationUid];
    const namespaceExists = !!this.nsMap[simulationUid];

    fatalAssert(
      simulationExists === namespaceExists,
      `Desync between simulation map and namespace map! simulationUid: ${simulationUid}, simulationExists: ${simulationExists}, namespaceExists: ${namespaceExists}`
    );

    return simulationExists;
  }

  public handleSimulationPing(
    simulationUid: string,
    body: SimulationPingPayload
  ) {
    const simulation = this.simulationMap[simulationUid];
    simulation.handleSimulationPing(body);
  }

  public sendSimulationPong(
    simulationUid: string,
    body: SimulationPongPayload
  ) {
    logSocketEmit(socketEvents.simulation.pong, simulationUid, body);
    const ns = this.nsMap[simulationUid];
    ns.emit(socketEvents.simulation.pong, body);
  }

  public handleSimulationCreateNode(
    simulaitonUid: string,
    body: SimulationCreateNodePayload
  ) {
    const simulation = this.simulationMap[simulaitonUid];
    simulation.handleSimulationCreateNode(body);
  }

  public sendSimulationNodeCreated(
    simulationUid: string,
    body: SimulationNodeCreatedPayload
  ) {
    logSocketEmit(socketEvents.simulation.nodeCreated, simulationUid, body);
    const ns = this.nsMap[simulationUid];
    ns.emit(socketEvents.simulation.nodeCreated, body);
  }
}

export const simulationBridge = new SimulationBridge();
