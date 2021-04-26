import _ from 'lodash';
import { Controller, Get, Post, Query, Route, Tags } from 'tsoa';

import { hasValue } from '../../common/utils/hasValue';
import { simulationManager } from '../../core/simulationManager';
import { SimulationSaveModel } from '../../database/SimulationSaveDataModel';
import { socketManager } from '../../socketManager';
import { simulationUidGenerator } from '../../utils/uidGenerators';
import { SimulationSaveMetadataList } from '../../common/saveLoad/SimulationSaveMetadataList';

@Tags('Simulation Instance Broker')
@Route('simulationInstanceBroker')
export class SimulationInstanceBrokerController extends Controller {
  /**
   * Create a new simulation instance, associate a new socket.io namespace for it and return the namespce.
   * Returns the socket.io namespace for the new simulation instance.
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

    console.log(`Created simulation instance with uid: ${uidStr}`);

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
        `A simulation with ID ${saveData.snapshot.simulationUid} already exists! Refusing to load.`
      );
    }

    const ns = socketManager.getOrCreateNamespace(
      saveData.snapshot.simulationUid
    );
    simulationManager.createSimulationWithSnapshot(saveData.snapshot, ns);

    console.log(
      `Loaded simulation instance with uid: ${saveData.snapshot.simulationUid}`
    );

    return saveData.snapshot.simulationUid;
  }

  /**
   * Saves an active simulation.
   */
  @Post('save/{simulationUid}')
  public async save(simulationUid: string): Promise<void> {
    const snapshot = simulationManager.getSimulationSnapshot(simulationUid);

    await SimulationSaveModel.updateOne(
      { 'snapshot.simulationUid': simulationUid },
      { snapshot },
      {
        upsert: true,
      }
    );

    console.log(
      `Saved simulation instance with uid: ${snapshot.simulationUid}`
    );
  }

  /**
   * Checks if a simulation with given uid exists.
   */
  @Get('check')
  public async check(@Query() simulationUid: string): Promise<boolean> {
    return simulationManager.checkSimulationExists(simulationUid);
  }

  /**
   * Returns all saved simulations.
   */
  @Get('savedSimulations')
  public async savedSimulations(): Promise<SimulationSaveMetadataList> {
    const allSaved = await SimulationSaveModel.find();
    const filtered = _.chain(allSaved)
      .filter(hasValue)
      .map((d) => ({
        documentId: d._id,
        simulationUid: d.snapshot.simulationUid,
        lastUpdate: d.updatedAt,
        isActive: simulationManager.checkSimulationExists(
          d.snapshot.simulationUid
        ),
      }))
      .value();

    return { metadatas: filtered };
  }
}
