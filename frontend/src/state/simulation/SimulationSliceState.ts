import { SimulationData } from './SimulationData';

export interface SimulationSliceState {
  [simulationUid: string]: SimulationData;
}
