/*************************************************
 * REQUIREMENTS FOR A COMPLETE REPLACEMENT
 *
 * > Log outgoing custom events (.emit)
 * > Log incoming custom events (.on)
 * > Log native events (connect, disconnect, ...)
 * > Log level control with environment variable
 *
 *************************************************
 * ALTERNATIVES
 *
 * > A simpler way of logging the incoming custom events:
 *   https://github.com/hden/socketio-wildcard#sunsetting
 *   https://socket.io/docs/v2/server-api/index.html#socket-use-fn
 *
 *   Limitations:
 *       1. only incoming events
 *       2. only custom events
 *
 * > A simpler (and perhaps safer) way of logging the outgoing custom events:
 *
 *   export const emit(...) {
 *       log(event, params)
 *       realEmit(...);
 *   }
 *
 *   And the consumers would use our emit implementation instead of directly
 *   calling the real emit.
 *
 *   Limitations:
 *       1. only outgoing events
 *       2. only custom events
 *
 *************************************************
 * FLAWS
 *
 * > We can only log incoming events if someone has already registered for it.
 * > This concept feels like overengineering and not safe at all, and I feel like
 *   something is going to blow up as we start using more complex stuff.
 *
 *************************************************
 * TODO
 *
 * > Instead of disabling only the logging, we should disable everything and run
 *   a stub middleware if the log level is 'none'.
 *
 *************************************************
 * Tarık, 2020-12-22 20:25
 */

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

const wrapEmit = <TReturn, TEvent extends string | Symbol>(
  isNs: boolean,
  event: TEvent,
  socketOrNsp: Socket | Namespace,
  args: any[],
  realEmit: (event: TEvent, ...args: any[]) => TReturn
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
