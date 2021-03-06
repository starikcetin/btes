import React from 'react';
import Xarrow from 'react-xarrows';

import { NodeConnectionData } from '../../state/simulation/data/ConnectionData';

interface SimulationNodeConnectionProps {
  simulationUid: string;
  connection: NodeConnectionData;
}

export const SimulationNodeConnection: React.FC<SimulationNodeConnectionProps> = (
  props
) => {
  const { connection, simulationUid } = props;

  return (
    <div>
      <Xarrow
        start={simulationUid + '-' + connection.firstNodeUid}
        end={simulationUid + '-' + connection.secondNodeUid}
        headSize={0}
        path={'smooth'}
        curveness={0.4}
        strokeWidth={1}
      />
    </div>
  );
};
