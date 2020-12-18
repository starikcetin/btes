export function logSocketEmit(
  eventName: string,
  simulationUid: string,
  body: unknown
): void {
  console.log('sending', eventName, 'to', simulationUid, 'with', body);
}

export function logSocketReceive(
  eventName: string,
  simulationUid: string,
  body: unknown
): void {
  console.log('received', eventName, 'from', simulationUid, 'with', body);
}
