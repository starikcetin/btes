import { SimulationData } from './data/SimulationData';

export interface SimulationSliceState {
  [simulationUid: string]: SimulationData;
}
