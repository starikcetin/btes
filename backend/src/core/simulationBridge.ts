import { Namespace } from 'socket.io';
import { Simulation } from './Simulation';
import { fatalAssert } from '../utils/fatalAssert';

class SimulationBridge {
  private uidToSimulationMap: { [key: string]: Simulation } = {};
  private uidToNsMap: { [key: string]: Namespace } = {};

  public createSimulation(simulationUid: string, ns: Namespace) {
    const newSimulation = new Simulation(simulationUid);
    this.uidToSimulationMap[simulationUid] = newSimulation;
    this.uidToNsMap[simulationUid] = ns;
  }

  public checkSimulationExists(simulationUid: string): boolean {
    const simulationExists = !!this.uidToSimulationMap[simulationUid];
    const namespaceExists = !!this.uidToNsMap[simulationUid];

    fatalAssert(
      simulationExists === namespaceExists,
      `Desync between simulation map and namespace map! simulationExists: ${simulationExists}, namespaceExists: ${namespaceExists}`
    );

    return simulationExists;
  }

  public handleSimulationPing(simulationUid: string, body: { date: number }) {
    const simulation = this.uidToSimulationMap[simulationUid];
    simulation.handleSimulationPing(body);
  }

  public sendSimulationPong(
    simulationUid: string,
    body: {
      pingDate: number;
      pongDate: number;
    }
  ) {
    console.log('sending simulation-pong:', body);
    const ns = this.uidToNsMap[simulationUid];
    ns.emit('simulation-pong', body);
  }

  public handleSimulationCreateNode(simulaitonUid: string, body: { positionX: number; positionY: number; }) {
    const simulation = this.uidToSimulationMap[simulaitonUid];
    simulation.handleSimulationCreateNode(body);
  }

  public sendSimulationNodeCreated(simulationUid: string, body: { nodeUid: string; positionX: number; positionY: number; }) {
    console.log("sending simulation-node-created:", body);
    const ns = this.uidToNsMap[simulationUid];
    ns.emit("simulation-node-created", body);
  }
}

export const simulationBridge = new SimulationBridge();
