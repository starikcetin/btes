import { Namespace } from 'socket.io';
import { Simulation } from './Simulation';
import { fatalAssert } from '../utils/fatalAssert';
import { SimulationNamespaceListener } from './SimulationNamespaceListener';
import { CommandHistoryManager } from './undoRedo/CommandHistoryManager';
import { SimulationNamespaceEmitter } from './SimulationNamespaceEmitter';
import { NodeConnectionMap } from './network/NodeConnectionMap';

class SimulationManager {
  private readonly simulationMap: { [simulationUid: string]: Simulation } = {};
  private readonly nsMap: { [simulationUid: string]: Namespace } = {};

  private readonly listenerMap: {
    [simulaitonUid: string]: SimulationNamespaceListener;
  } = {};

  private readonly emitterMap: {
    [simulaitonUid: string]: SimulationNamespaceEmitter;
  } = {};

  public readonly createSimulation = (simulationUid: string, ns: Namespace) => {
    const commandHistoryManager = new CommandHistoryManager();
    const socketEmitter = new SimulationNamespaceEmitter(ns);
    const connectionMap = new NodeConnectionMap(socketEmitter);

    const simulation = new Simulation(
      socketEmitter,
      connectionMap,
      simulationUid
    );

    const listener = new SimulationNamespaceListener(
      simulation,
      ns,
      commandHistoryManager,
      socketEmitter
    );

    this.simulationMap[simulationUid] = simulation;
    this.nsMap[simulationUid] = ns;
    this.listenerMap[simulationUid] = listener;
    this.emitterMap[simulationUid] = socketEmitter;
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
