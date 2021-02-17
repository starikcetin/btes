import { Namespace } from 'socket.io';
import { Simulation } from './Simulation';
import { fatalAssert } from '../utils/fatalAssert';
import { SimulationNamespaceListener } from './SimulationNamespaceListener';
import { CommandHistoryManager } from './undoRedo/CommandHistoryManager';
import { SimulationNamespaceEmitter } from './SimulationNamespaceEmitter';

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
    const actionHistoryKeeper = new CommandHistoryManager();
    const emitter = new SimulationNamespaceEmitter(ns);
    const newSimulation = new Simulation(emitter, simulationUid);
    const listener = new SimulationNamespaceListener(
      newSimulation,
      ns,
      actionHistoryKeeper,
      emitter
    );

    this.simulationMap[simulationUid] = newSimulation;
    this.nsMap[simulationUid] = ns;
    this.listenerMap[simulationUid] = listener;
    this.emitterMap[simulationUid] = emitter;
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
