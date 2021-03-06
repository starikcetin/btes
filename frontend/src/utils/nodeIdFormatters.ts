const nodeElementIdFormatter = (
  part: string,
  simulationUid: string,
  nodeUid: string
): string => `node-${part}-id__sim-${simulationUid}__node-${nodeUid}`;

export const nodeCardIdFormatter = nodeElementIdFormatter.bind(this, 'card');
