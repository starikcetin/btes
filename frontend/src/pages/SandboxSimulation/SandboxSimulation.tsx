import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';

import './SandboxSimulation.scss';
import { RootState } from '../../state/RootState';
import NodeModal from '../../components/NodeModal/NodeModal';
import { simulationBridge } from '../../services/simulationBridge';
import { SimulationNode } from '../../components/SimulationNode/SimulationNode';

interface SandboxSimulationParamTypes {
  simulationUid: string;
}

const SandboxSimulation: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const { simulationUid } = useParams<SandboxSimulationParamTypes>();

  const nodes = useSelector((state: RootState) =>
    Object.values(state.simulation[simulationUid]?.nodeMap || {})
  );

  const [viewingNodeUid, setViewingNodeUid] = useState<string | null>(null);

  const connect = useCallback(async () => {
    await simulationBridge.connect(simulationUid);
    setConnected(true);
  }, [simulationUid]);

  const teardown = useCallback(() => {
    simulationBridge.teardown(simulationUid);
  }, [simulationUid]);

  const sendSimulationPingOnClick = () => {
    simulationBridge.sendSimulationPing(simulationUid, { date: Date.now() });
  };

  const createNode = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    simulationBridge.sendSimulationCreateNode(simulationUid, {
      positionX: event.pageX,
      positionY: event.pageY - 50, // 50 is element height compensation
    });
  };

  useEffect(() => {
    connect();

    return () => {
      teardown();
    };
  }, [connect, teardown]);

  return (
    <div className="sandbox-simulation-page container-fluid">
      {connected ? (
        <>
          <div className="row">
            <ContextMenuTrigger id="rightClickArea" holdToDisplay={-1}>
              <div className="d-flex position-absolute h-100 border w-100">
                {nodes.map((node) => (
                  <SimulationNode
                    key={node.nodeUid}
                    simulationUid={simulationUid}
                    data={node}
                    launchHandler={(nodeUid) => setViewingNodeUid(nodeUid)}
                  ></SimulationNode>
                ))}
              </div>
            </ContextMenuTrigger>
            <ContextMenu id="rightClickArea">
              <MenuItem onClick={createNode}>Create Node</MenuItem>
              <MenuItem onClick={sendSimulationPingOnClick}>Send Ping</MenuItem>
            </ContextMenu>
          </div>
          <NodeModal
            closeHandler={() => setViewingNodeUid(null)}
            simulationUid={simulationUid}
            nodeUid={viewingNodeUid}
          />
        </>
      ) : (
        <div>
          <span>Connecting to simulation {simulationUid}...</span>
        </div>
      )}
    </div>
  );
};

export default SandboxSimulation;
