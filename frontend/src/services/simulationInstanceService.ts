import axios from 'axios';

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
}

export const simulationInstanceService = new SimulationInstanceService();
