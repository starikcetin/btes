import { Namespace } from 'socket.io';
import { Simulation } from './Simulation';
import { fatalAssert } from '../utils/fatalAssert';
import { SimulationNamespaceListener } from './SimulationNamespaceListener';

class SimulationManager {
  private readonly simulationMap: { [simulationUid: string]: Simulation } = {};
  private readonly nsMap: { [simulationUid: string]: Namespace } = {};

  private readonly listenerMap: {
    [simulaitonUid: string]: SimulationNamespaceListener;
  } = {};

  public readonly createSimulation = (simulationUid: string, ns: Namespace) => {
    const newSimulation = new Simulation(simulationUid);
    const listener = new SimulationNamespaceListener(newSimulation, ns);

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
}

export const simulationManager = new SimulationManager();
