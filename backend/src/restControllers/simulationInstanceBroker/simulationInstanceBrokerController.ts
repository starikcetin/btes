import { Controller, Get, Query, Route } from 'tsoa';
import { simulationBridge } from '../../core/simulationBridge';
import { socketManager } from '../../socketManager';
import { simulationUidGenerator } from '../../utils/uidGenerators';

@Route('simulationInstanceBroker')
export class SimulationInstanceBrokerController extends Controller {
  /**
   * Create a new simulation instance, associate a new socket.io namespace for it and return the namespce.
   * @returns The socket.io namespace for the new simulation instance.
   */
  @Get('create')
  public async create(): Promise<string> {
    const uidStr = simulationUidGenerator.next().toString();

    if (simulationBridge.checkSimulationExists(uidStr)) {
      throw new Error(
        `A simulation with ID ${uidStr} already exists! Refusing to create.`
      );
    }

    const ns = socketManager.getOrCreateNamespace(uidStr);
    simulationBridge.setupNewSimulation(uidStr, ns);

    console.log(
      `created simulation instance with uid: ${uidStr} name: ${ns.name}`
    );

    return uidStr;
  }

  /**
   * Checks if a simulation with given uid exists.
   */
  @Get('check')
  public async check(@Query() simulationUid: string): Promise<boolean> {
    return simulationBridge.checkSimulationExists(simulationUid);
  }
}
