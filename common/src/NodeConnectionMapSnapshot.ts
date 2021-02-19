import { NodeConnectionSnapshot } from './NodeConnectionSnapshot';

export interface NodeConnectionMapSnapshot {
  readonly connectionMap: {
    readonly [firstNodeUid: string]: {
      readonly [secondNodeUid: string]: NodeConnectionSnapshot;
    };
  };
}
