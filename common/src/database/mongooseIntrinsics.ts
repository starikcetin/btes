/*
 * Redefined Mongoose intrinsic types.
 * We are defining these types here to avoid bundling mongoose with frontend.
 */

export type MongooseDocument_WithId = {
  _id: string;
};

export type MongooseDocument_WithTimestamps = {
  createdAt: Date;
  updatedAt: Date;
};
