import { Controller, Get, Post, Query, Route, Tags } from 'tsoa';
import { hasValue } from '../../common/utils/hasValue';
import { simulationManager } from '../../core/simulationManager';
import { SimulationSaveModel } from '../../database/SimulationSaveDataModel';
import { socketManager } from '../../socketManager';
import { simulationUidGenerator } from '../../utils/uidGenerators';

@Tags('Simulation Instance Broker')
@Route('simulationInstanceBroker')
export class SimulationInstanceBrokerController extends Controller {
  /**
   * Create a new simulation instance, associate a new socket.io namespace for it and return the namespce.
   * @returns The socket.io namespace for the new simulation instance.
   */
  @Get('create')
  public async create(): Promise<string> {
    const uidStr = simulationUidGenerator.next().toString();

    if (simulationManager.checkSimulationExists(uidStr)) {
      throw new Error(
        `A simulation with ID ${uidStr} already exists! Refusing to create.`
      );
    }

    const ns = socketManager.getOrCreateNamespace(uidStr);
    simulationManager.createSimulation(uidStr, ns);

    console.log(
      `created simulation instance with uid: ${uidStr} name: ${ns.name}`
    );

    return uidStr;
  }

  /**
   * Loads a saved simulation.
   */
  @Get('load/{simulationSaveDataId}')
  public async load(simulationSaveDataId: string): Promise<string> {
    const saveData = await SimulationSaveModel.findById(simulationSaveDataId);
    if (!hasValue(saveData)) {
      throw new Error('No save data found with given Id');
    }

    if (
      simulationManager.checkSimulationExists(saveData.snapshot.simulationUid)
    ) {
      throw new Error(
        `A simulation with ID ${saveData.snapshot.simulationUid} already exists! Refusing to create.`
      );
    }

    const ns = socketManager.getOrCreateNamespace(
      saveData.snapshot.simulationUid
    );
    simulationManager.createSimulationWithSnapshot(saveData.snapshot);

    console.log(
      `restored simulation instance with uid: ${saveData.snapshot.simulationUid} name: ${ns.name}`
    );

    return saveData.snapshot.simulationUid;
  }

  /**
   * Saves an active simulation.
   */
  @Post('save/{simulationUid}')
  public async save(simulationUid: string): Promise<void> {
    const snapshot = simulationManager.getSimulationSnapshot(simulationUid);
    await SimulationSaveModel.create({ snapshot });
  }

  /**
   * Checks if a simulation with given uid exists.
   */
  @Get('check')
  public async check(@Query() simulationUid: string): Promise<boolean> {
    return simulationManager.checkSimulationExists(simulationUid);
  }
}
