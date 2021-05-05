import axios from 'axios';

import { SimulationSaveMetadataList } from '../../../common/src/saveLoad/SimulationSaveMetadataList';
import { ensureDate } from '../utils/ensureDate';
import { SimulationExport } from '../../../backend/src/common/importExport/SimulationExport';
import axiosAuth from '../helpers/axiosAuth';

class SimulationInstanceService {
  public async create(): Promise<string> {
    console.log('requesting simulation instance');

    const response = await axios.get<string>(
      '/api/rest/simulationInstanceBroker/create'
    ); // 'await' isteğin cevabını bekliyor
    const simulationUid = response.data;

    console.log('simulation create response: ', response);

    return simulationUid;
  }

  public async check(simulationUid: string): Promise<boolean> {
    console.log('checking simulation instance: ', simulationUid);

    const response = await axios.get<boolean>(
      '/api/rest/simulationInstanceBroker/check',
      {
        params: { simulationUid },
      }
    );
    const checkResult = response.data;

    console.log('check result for ', simulationUid, ' : ', checkResult);

    return checkResult;
  }

  public async save(simulationUid: string): Promise<void> {
    console.log('saving simulation instance: ', simulationUid);
    await axiosAuth().post(
      `/api/rest/simulationInstanceBroker/save/${simulationUid}`
    );
    console.log('saved simulation instance: ', simulationUid);
  }

  /**
   * @returns the simulationUid not simulationSaveDataUid!
   */
  public async load(simulationSaveDataId: string): Promise<string> {
    console.log('loading simulation instance: ', simulationSaveDataId);
    const resp = await axios.get<string>(
      `/api/rest/simulationInstanceBroker/load/${simulationSaveDataId}`
    );
    const simulationUid = resp.data;
    console.log('loaded simulation instance: ', simulationUid);
    return simulationUid;
  }

  /**
   * @returns metadatas of user's saved simulations.
   */
  public async getUserSavedSimulations(): Promise<SimulationSaveMetadataList> {
    const resp = await axiosAuth().get<SimulationSaveMetadataList>(
      `/api/rest/simulationInstanceBroker/userSavedSimulations`
    );
    return this.prepareSavedSimulations(resp.data);
  }

  /**
   * Launches the export url in a new page (tab/window).
   */
  public openExportUrl(simulationUid: string): void {
    window.open(
      `/api/rest/simulationInstanceBroker/export/${simulationUid}`,
      '_blank'
    );
  }

  /**
   * @param simulaitonExport The exported data.
   * @returns The simulationUid.
   */
  public async import(simulaitonExport: SimulationExport): Promise<string> {
    const resp = await axios.post<string>(
      '/api/rest/simulationInstanceBroker/import',
      simulaitonExport
    );

    return resp.data;
  }

  private readonly prepareSavedSimulations = (
    rawData: SimulationSaveMetadataList
  ): SimulationSaveMetadataList => {
    return {
      ...rawData,
      metadatas: rawData.metadatas.map((metadata) => ({
        ...metadata,
        lastUpdate: ensureDate(metadata.lastUpdate),
      })),
    };
  };
}

export const simulationInstanceService = new SimulationInstanceService();
