import {
  MongooseDocument_WithId,
  MongooseDocument_WithTimestamps,
} from './mongooseIntrinsics';

/** Data type for testing mongo db connections. */
export type TestDataRaw = {
  foo: number;
  bar: string;
};

/** Data type for testing mongo db connections. */
export type TestData = TestDataRaw &
  MongooseDocument_WithId &
  MongooseDocument_WithTimestamps;
