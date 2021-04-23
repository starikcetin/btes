import axios from 'axios';
import { SimulationSaveMetadata } from '../../../common/src/saveLoad/SimulationSaveMetadata';

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
    await axios.post(
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
   * @returns metadatas of all saved simulations.
   */
  public async getSavedSimulations(): Promise<SimulationSaveMetadata> {
    const resp = await axios.get<SimulationSaveMetadata>(
      `/api/rest/simulationInstanceBroker/listSavedSimulations`
    );
    return resp.data;
  }
}

export const simulationInstanceService = new SimulationInstanceService();
