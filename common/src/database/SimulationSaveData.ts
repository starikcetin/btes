import { SimulationSnapshot } from '../SimulationSnapshot';
import {
  MongooseDocument_WithId,
  MongooseDocument_WithTimestamps,
} from './mongooseIntrinsics';

/** Data type for Simulation */
export type SimulationSaveDataRaw = {
  snapshot: SimulationSnapshot;
  username: string;
};

/** Data type for Simulation */
export type SimulationSaveData = SimulationSaveDataRaw &
  MongooseDocument_WithId &
  MongooseDocument_WithTimestamps;
