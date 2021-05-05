import _ from 'lodash';
import { Body, Controller, Get, Post, Query, Request, Route, Tags } from 'tsoa';
import { Security } from '@tsoa/runtime';

import { hasValue } from '../../common/utils/hasValue';
import { simulationManager } from '../../core/simulationManager';
import { socketManager } from '../../socketManager';
import { simulationUidGenerator } from '../../utils/uidGenerators';
import { SimulationSaveMetadataList } from '../../common/saveLoad/SimulationSaveMetadataList';
import { SimulationSaveDataRaw } from '../../common/database/SimulationSaveData';
import { SimulationExport } from '../../common/importExport/SimulationExport';
import { AuthenticatedExpressRequest } from '../../auth/AuthenticatedExpressRequest';
import { SimulationSaveModel } from '../../database/SimulationSaveDataModel';

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
  @Security('jwt')
  public async save(
    @Request() req: AuthenticatedExpressRequest,
    simulationUid: string
  ): Promise<void> {
    const { username } = req.user;
    const snapshot = simulationManager.getSimulationSnapshot(simulationUid);

    await SimulationSaveModel.updateOne(
      { 'snapshot.simulationUid': simulationUid },
      { username, snapshot },
      {
        upsert: true,
      }
    );

    console.log(
      `Saved simulation instance with uid: ${snapshot.simulationUid}`
    );
  }

  /**
   * Imports a simulation save from the request body.
   * Returns the simulationUid.
   */
  @Post('import')
  public async import(@Body() body: SimulationExport): Promise<string> {
    const { base64 } = body;
    const json = Buffer.from(base64, 'base64').toString();
    const rawSave: SimulationSaveDataRaw = JSON.parse(json);
    const { snapshot } = rawSave;

    if (simulationManager.checkSimulationExists(snapshot.simulationUid)) {
      throw new Error(
        `A simulation with ID ${snapshot.simulationUid} already exists! Refusing to import.`
      );
    }

    const ns = socketManager.getOrCreateNamespace(snapshot.simulationUid);
    simulationManager.createSimulationWithSnapshot(snapshot, ns);

    console.log(
      `Imported simulation instance with uid: ${snapshot.simulationUid}`
    );

    return snapshot.simulationUid;
  }

  /**
   * Exports an active simulation's save as a file.
   * Returns the snapshot as a file to download.
   */
  @Get('export/{simulationUid}')
  public async export(simulationUid: string): Promise<SimulationExport> {
    const snapshot = simulationManager.getSimulationSnapshot(simulationUid);

    this.setHeader(
      'Content-Disposition',
      `attachment; filename="${simulationUid}.btes"`
    );

    console.log(
      `Exported simulation instance with uid: ${snapshot.simulationUid}`
    );

    const rawSave: SimulationSaveDataRaw = { snapshot };
    const json = JSON.stringify(rawSave);
    const base64 = Buffer.from(json).toString('base64');

    return { base64 };
  }

  /**
   * Checks if a simulation with given uid exists.
   */
  @Get('check')
  public async check(@Query() simulationUid: string): Promise<boolean> {
    return simulationManager.checkSimulationExists(simulationUid);
  }

  /**
   * Returns user's saved simulations.
   */
  @Get('userSavedSimulations')
  @Security('jwt')
  public async userSavedSimulations(
    @Request() req: AuthenticatedExpressRequest
  ): Promise<SimulationSaveMetadataList> {
    const { username } = req.user;
    const allSaved = await SimulationSaveModel.find();
    const filtered = _.chain(allSaved)
      .filter((sim) => hasValue(sim) && sim.username === username)
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
