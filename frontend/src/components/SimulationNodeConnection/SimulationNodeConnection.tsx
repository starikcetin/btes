import React from 'react';
import Xarrow from 'react-xarrows';

interface SimulationNodeConnectionProps {
  startRef: string;
  endRef: string;
  simulationUid: string;
}

const SimulationNodeConnection: React.FC<SimulationNodeConnectionProps> = (
  props
) => {
  const { startRef, endRef, simulationUid } = props;
  return (
    <div>
      {console.log(simulationUid, startRef, endRef)}
      <Xarrow
        start={simulationUid + '-' + startRef}
        end={simulationUid + '-' + endRef}
        headSize={0}
        path={'smooth'}
        curveness={0.4}
        strokeWidth={1}
      />
    </div>
  );
};

export default SimulationNodeConnection;
