import { Namespace } from 'socket.io';

/**
 * @returns The number of sockets connected to given namespace.
 */
export function getClientCount(ns: Namespace): number {
  return Object.keys(ns.clients).length;
}
