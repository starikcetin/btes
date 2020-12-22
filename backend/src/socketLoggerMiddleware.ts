/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Socket } from 'socket.io';

const SocketLogLevels = ['none', 'summary', 'full'] as const;
type SocketLogLevel = typeof SocketLogLevels[number];

const socketLogLevel: SocketLogLevel = resolveLogLevel();

export const socketLoggerMiddleware = (
  socket: Socket,
  next: (err?: never) => void
): void => {
  if (socketLogLevel !== 'none') {
    const realSocketEmit = socket.emit.bind(socket);
    const realSocketOn = socket.on.bind(socket);
    const realNspEmit = socket.nsp.emit.bind(socket.nsp);
    const realNspOn = socket.nsp.on.bind(socket.nsp);

    socket.emit = (event, ...args) =>
      wrapEmit(event, socket, args, realSocketEmit);

    socket.on = (event, listener) =>
      wrapOn(socket, event, listener, realSocketOn);

    socket.nsp.emit = (event, ...args) =>
      wrapEmit(event, socket, args, realNspEmit);

    socket.nsp.on = (event: string, listener: Function) =>
      wrapOn(socket, event, listener, realNspOn);
  }

  next();
};

function wrapEmit(
  event: string | symbol,
  socket: Socket,
  args: any[],
  realEmit: (event: string | symbol, ...args: any[]) => boolean
) {
  switch (event) {
    case 'connection':
    case 'disconnection':
    case 'disconnecting':
      // ignore
      break;

    case 'connect':
    case 'disconnect':
      log([`[socket --> ${socket.id}]`, event]);
      break;

    default:
      log([`[socket --> ${socket.id}]`, event], [...args]);
      break;
  }

  return realEmit(event, ...args);
}

function wrapOn(
  socket: Socket,
  event: string | symbol,
  listener: Function,
  realOn: any
) {
  const wrappedListener = makeWrappedListener(socket, event, listener);
  return realOn(event, wrappedListener);
}

function makeWrappedListener(
  socket: Socket,
  event: string | symbol,
  listener: Function
) {
  return (...listenerArgs: any[]): any => {
    switch (event) {
      case 'connection':
      case 'disconnection':
      case 'disconnecting':
        //ignore
        break;

      case 'connect':
      case 'disconnect':
        log([`[socket <-- ${socket.id}]`, event]);
        break;

      default:
        log([`[socket <-- ${socket.id}]`, event], [...listenerArgs]);
        break;
    }

    return listener(...listenerArgs);
  };
}

function log(summary: any[], full: any[] = []) {
  if (socketLogLevel === 'full') {
    console.log(...summary, ...full);
  } else if (socketLogLevel === 'summary') {
    console.log(...summary);
  }
}

function resolveLogLevel(): SocketLogLevel {
  const logLevelRaw = process.env.SOCKET_LOG_LEVEL;

  if (logLevelRaw && !SocketLogLevels.some((s) => logLevelRaw === s)) {
    const valid = SocketLogLevels.join(', ');
    throw `SOCKET_LOG_LEVEL environment variable is invalid. Given: ${logLevelRaw} | Valid: ${valid}`;
  }

  return (process.env.SOCKET_LOG_LEVEL || 'summary') as SocketLogLevel;
}
