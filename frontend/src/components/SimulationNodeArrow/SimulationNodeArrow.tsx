import React from 'react';
import Xarrow from 'react-xarrows';

interface SimulationNodeArrowProps {
  startRef: string;
  endRef: string;
  simulationUid: string;
}

const SimulationNodeArrow: React.FC<SimulationNodeArrowProps> = (props) => {
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

export default SimulationNodeArrow;
