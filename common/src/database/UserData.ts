import {
  MongooseDocument_WithId,
  MongooseDocument_WithTimestamps,
} from './mongooseIntrinsics';
import { UserLessonData } from './UserLessonData';

/** Data type representing a User. */
export type UserDataRaw = {
  username: string;
  passwordHash: string;
  email: string;
  lessonData: UserLessonData;
};

/** Data type representing a User. */
export type UserData = UserDataRaw &
  MongooseDocument_WithId &
  MongooseDocument_WithTimestamps;
