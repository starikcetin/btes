import {
  MongooseDocument_WithId,
  MongooseDocument_WithTimestamps,
} from './mongooseIntrinsics';

/** Data type representing a User. */
export type UserDataRaw = {
  username: string;
  passwordHash: string;
  email: string;
};

/** Data type representing a User. */
export type UserData = UserDataRaw &
  MongooseDocument_WithId &
  MongooseDocument_WithTimestamps;
