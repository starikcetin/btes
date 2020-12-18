export const socketEvents = {
  native: {
    connect: 'connect',
    disconnect: 'disconnect',
  },
  simulation: {
    welcome: 'simulation-welcome',
    ping: 'simulation-ping',
    pong: 'simulation-pong',
    createNode: 'simulation-create-node',
    nodeCreated: 'simulation-node-created',
  },
} as const;
