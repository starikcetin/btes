import mongoose from 'mongoose';

const mongoOptions: mongoose.ConnectOptions = {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
  useFindAndModify: false,
  poolSize: 50,
};

export const connectToDb = async (
  connectionString: string
): Promise<mongoose.Mongoose> => {
  return mongoose.connect(connectionString, mongoOptions);
};
