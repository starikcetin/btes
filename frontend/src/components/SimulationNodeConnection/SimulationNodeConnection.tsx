import React from 'react';
import Xarrow from 'react-xarrows';

import { NodeConnectionData } from '../../state/simulation/data/ConnectionData';
import { nodeCardIdFormatter } from '../../utils/nodeIdFormatters';

interface SimulationNodeConnectionProps {
  simulationUid: string;
  connection: NodeConnectionData;
  launchHandler: (connection: NodeConnectionData) => void;
}

export const SimulationNodeConnection: React.FC<SimulationNodeConnectionProps> = (
  props
) => {
  const { connection, simulationUid, launchHandler } = props;

  const click = () => {
    launchHandler(connection);
  };

  return (
    <div>
      <Xarrow
        start={nodeCardIdFormatter(simulationUid, connection.firstNodeUid)}
        end={nodeCardIdFormatter(simulationUid, connection.secondNodeUid)}
        headSize={0}
        path={'smooth'}
        curveness={0.4}
        strokeWidth={3}
        passProps={{ onClick: click, cursor: 'pointer' }}
      />
    </div>
  );
};
