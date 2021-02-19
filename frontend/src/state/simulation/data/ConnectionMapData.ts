import { NodeConnectionData } from './ConnectionData';

export interface NodeConnectionMapData {
  readonly connectionMap: {
    readonly [firstNodeUid: string]: {
      readonly [secondNodeUid: string]: NodeConnectionData;
    };
  };
}
