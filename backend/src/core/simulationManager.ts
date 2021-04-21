import { Namespace } from 'socket.io';

import { Simulation } from './Simulation';
import { fatalAssert } from '../common/utils/fatalAssert';
import { SimulationNamespaceListener } from './SimulationNamespaceListener';
import { CommandHistoryManager } from './undoRedo/CommandHistoryManager';
import { SimulationNamespaceEmitter } from './SimulationNamespaceEmitter';
import { NodeConnectionMap } from './network/NodeConnectionMap';
import { ControlledTimerService } from './network/ControlledTimerService';
import { SimulationSnapshot } from '../common/SimulationSnapshot';

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
    const timerService = new ControlledTimerService(socketEmitter);

    const simulation = new Simulation(
      socketEmitter,
      connectionMap,
      timerService,
      simulationUid
    );

    const listener = new SimulationNamespaceListener(
      simulation,
      ns,
      commandHistoryManager,
      connectionMap,
      timerService,
      socketEmitter
    );

    this.simulationMap[simulationUid] = simulation;
    this.nsMap[simulationUid] = ns;
    this.listenerMap[simulationUid] = listener;
    this.emitterMap[simulationUid] = socketEmitter;

    timerService.begin();
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

  public readonly getSimulationSnapshot = (
    simulationUid: string
  ): SimulationSnapshot => {
    if (!this.checkSimulationExists(simulationUid)) {
      throw new Error(`No simulation found with uid  ${simulationUid}!`);
    }

    return this.simulationMap[simulationUid].takeSnapshot();
  };

  public readonly createSimulationWithSnapshot = (
    snapshot: SimulationSnapshot
  ): string => {
    // TODO: implement
    throw new Error('Not implemented yet.');
  };
}

export const simulationManager = new SimulationManager();
