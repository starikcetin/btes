/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Socket } from 'socket.io';

const SocketLogLevels = ['none', 'summary', 'full'] as const;
type SocketLogLevel = typeof SocketLogLevels[number];

const resolveLogLevel = (): SocketLogLevel => {
  const rawLogLevel = process.env.SOCKET_LOG_LEVEL;

  if (rawLogLevel && !SocketLogLevels.some((s) => rawLogLevel === s)) {
    const valid = SocketLogLevels.join(', ');
    throw `SOCKET_LOG_LEVEL environment variable is invalid. Given: ${rawLogLevel} | Valid: ${valid}`;
  }

  return (rawLogLevel || 'summary') as SocketLogLevel;
};

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
      wrapEmit(false, event, socket, args, realSocketEmit);

    socket.on = (event, listener) =>
      wrapOn(false, socket, event, listener, realSocketOn);

    socket.nsp.emit = (event, ...args) =>
      wrapEmit(true, event, socket, args, realNspEmit);

    socket.nsp.on = (event: string, listener: Function) =>
      wrapOn(true, socket, event, listener, realNspOn);
  }

  next();
};

const wrapEmit = (
  isNs: boolean,
  event: string | symbol,
  socket: Socket,
  args: any[],
  realEmit: (event: string | symbol, ...args: any[]) => boolean
) => {
  switch (event) {
    case 'connection':
    case 'disconnection':
    case 'disconnecting':
      // ignore
      break;

    case 'connect':
    case 'disconnect':
      log([`[${isNs ? 'nsp' : 'socket'} --> ${socket.id}]`, event]);
      break;

    default:
      log([`[${isNs ? 'nsp' : 'socket'}  --> ${socket.id}]`, event], [...args]);
      break;
  }

  return realEmit(event, ...args);
};

const wrapOn = (
  isNs: boolean,
  socket: Socket,
  event: string | symbol,
  listener: Function,
  realOn: any
) => {
  const wrappedListener = makeWrappedListener(isNs, socket, event, listener);
  return realOn(event, wrappedListener);
};

const makeWrappedListener = (
  isNs: boolean,
  socket: Socket,
  event: string | symbol,
  listener: Function
) => {
  return (...listenerArgs: any[]): any => {
    switch (event) {
      case 'connection':
      case 'disconnection':
      case 'disconnecting':
        //ignore
        break;

      case 'connect':
      case 'disconnect':
        log([`[${isNs ? 'nsp' : 'socket'} <-- ${socket.id}]`, event]);
        break;

      default:
        log(
          [`[${isNs ? 'nsp' : 'socket'} <-- ${socket.id}]`, event],
          [...listenerArgs]
        );
        break;
    }

    return listener(...listenerArgs);
  };
};

const log = (summary: any[], full: any[] = []) => {
  if (socketLogLevel === 'full') {
    console.log(...summary, ...full);
  } else if (socketLogLevel === 'summary') {
    console.log(...summary);
  }
};
