/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */

import { Socket, Namespace } from 'socket.io';

const SocketLogLevels = ['none', 'summary', 'full'] as const;
type SocketLogLevel = typeof SocketLogLevels[number];

const socketRegisteredMap: { [socketId: string]: boolean } = {};
const nspRegisteredMap: { [namespaceName: string]: boolean } = {};

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
    if (!socketRegisteredMap[socket.id]) {
      const realSocketEmit = socket.emit.bind(socket);
      const realSocketOn = socket.on.bind(socket);
      socketRegisteredMap[socket.id] = true;

      socket.emit = (event, ...args) =>
        wrapEmit(false, event, socket, args, realSocketEmit);

      socket.on = (event, listener) =>
        wrapOn(false, socket, event, listener, realSocketOn);
    }

    if (!nspRegisteredMap[socket.nsp.name]) {
      const realNspEmit = socket.nsp.emit.bind(socket.nsp);
      const realNspOn = socket.nsp.on.bind(socket.nsp);
      nspRegisteredMap[socket.nsp.name] = true;

      socket.nsp.emit = (event, ...args) =>
        wrapEmit(true, event, socket.nsp, args, realNspEmit);

      socket.nsp.on = (event: string, listener: Function) =>
        wrapOn(true, socket.nsp, event, listener, realNspOn);
    }
  }

  next();
};

const wrapEmit = (
  isNs: boolean,
  event: string | symbol,
  socketOrNsp: Socket | Namespace,
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
      if (isNs) {
        log([
          `[nsp **> ${(socketOrNsp as Namespace).name}]`,
          event,
          (args[0] as Socket).id,
        ]);
      } else {
        log([
          `[socket **> ${(socketOrNsp as Socket).id}]`,
          event,
          (args[0] as Socket).id,
        ]);
      }
      break;

    case 'disconnect':
      if (isNs) {
        log([`[nsp **> ${(socketOrNsp as Namespace).name}]`, event], [...args]);
      } else {
        log([`[socket **> ${(socketOrNsp as Socket).id}]`, event], [...args]);
      }
      break;

    default:
      if (isNs) {
        log([`[nsp --> ${(socketOrNsp as Namespace).name}]`, event], [...args]);
      } else {
        log([`[socket --> ${(socketOrNsp as Socket).id}]`, event], [...args]);
      }
      break;
  }

  return realEmit(event, ...args);
};

const wrapOn = (
  isNs: boolean,
  socketOrNsp: Socket | Namespace,
  event: string | symbol,
  listener: Function,
  realOn: any
) => {
  const wrappedListener = makeWrappedListener(
    isNs,
    socketOrNsp,
    event,
    listener
  );
  return realOn(event, wrappedListener);
};

const makeWrappedListener = (
  isNs: boolean,
  socketOrNsp: Socket | Namespace,
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
        if (isNs) {
          log([
            `[nsp <** ${(socketOrNsp as Namespace).name}]`,
            event,
            (listenerArgs[0] as Socket).id,
          ]);
        } else {
          log([
            `[socket <** ${(socketOrNsp as Socket).id}]`,
            event,
            (listenerArgs[0] as Socket).id,
          ]);
        }
        break;

      case 'disconnect':
        if (isNs) {
          log(
            [`[nsp <** ${(socketOrNsp as Namespace).name}]`, event],
            [...listenerArgs]
          );
        } else {
          log(
            [`[socket <** ${(socketOrNsp as Socket).id}]`, event],
            [...listenerArgs]
          );
        }
        break;

      default:
        if (isNs) {
          log(
            [`[nsp <-- ${(socketOrNsp as Namespace).name}]`, event],
            [...listenerArgs]
          );
        } else {
          log(
            [`[socket <-- ${(socketOrNsp as Socket).id}]`, event],
            [...listenerArgs]
          );
        }
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
