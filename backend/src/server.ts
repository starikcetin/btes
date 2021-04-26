import dotenv from 'dotenv';

// Parse the '.env' file
dotenv.config();

import { app } from './app';
import { socketManager } from './socketManager';
import { fatalAssert } from './common/utils/fatalAssert';
import { connectToDb } from './database/connectToDb';

// Get ports to use from environment parameters
const restPort = process.env.REST_PORT ?? 3001;
const socketPort = process.env.SOCKET_PORT ?? 3002;
const dbUri = process.env.DB_URI ?? 'mongodb://localhost:27017/btes';

fatalAssert(
  restPort != socketPort,
  "Socket port and REST port can't be the same! Fix it in your '.env' file."
);

// Start up the REST server
app.listen(restPort, () =>
  console.log(
    `REST server:\thttp://localhost:${restPort}\nREST Swagger:\thttp://localhost:${restPort}/swagger`
  )
);

// Start up the socket server
socketManager.start(socketPort, () =>
  console.log(`Socket server:\thttp://localhost:${socketPort}`)
);

// Connect to MongoDB
connectToDb(dbUri)
  .then(() => console.log(`Connected to MongoDB at ${dbUri}`))
  .catch((err) => {
    console.error(`Could not connect to MongoDB at ${dbUri}\nDetails:`, err);
  });
