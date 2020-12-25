import React, { useCallback, useEffect, useRef, useState } from 'react';
import './SandboxSimulation.scss';
import { useParams } from 'react-router-dom';
import { simulationBridge } from '../../services/simulationBridge';
import { useSelector } from 'react-redux';
import { RootState } from '../../state/RootState';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import NodeModal from '../../components/NodeModal/NodeModal';
// import nodeIcon from './pcIcon.png';
import { NodeData } from '../../state/simulation/NodeData';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { SimulationNode } from '../../components/SimulationNode/SimulationNode';

interface SandboxSimulationParamTypes {
  simulationUid: string;
}

const SandboxSimulation: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const simulationPongTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const { simulationUid } = useParams<SandboxSimulationParamTypes>();

  const simulationPongs = useSelector(
    (state: RootState) => state.simulation[simulationUid]?.pongs || []
  );

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

  const formatSimulationPongs = () => {
    const result = simulationPongs
      ?.map(
        (simPong) =>
          `ping: ${new Date(simPong.pingDate).toUTCString()}\t` +
          `pong: ${new Date(simPong.pongDate).toUTCString()}`
      )
      .reverse()
      .join('\n');

    return result || '';
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
              <div className="d-flex position-absolute h-75 border w-100">
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
              <MenuItem data={{ event: 'createNode' }} onClick={createNode}>
                <span className="menu-item bg-success border p-2">
                  Create Node
                </span>
              </MenuItem>
            </ContextMenu>
            {viewingNodeUid && (
              <NodeModal
                show={true}
                closeHandler={() => setViewingNodeUid(null)}
                simulationUid={simulationUid}
                nodeUid={viewingNodeUid}
              />
            )}
          </div>
          <div className="fixed-bottom d-flex row align-content-center m-3">
            <div className="input-group">
              <div className="input-group-append">
                <input
                  type="button"
                  className="form-control btn btn-outline-success"
                  onClick={sendSimulationPingOnClick}
                  value="Send Simulation Ping"
                />
              </div>
              <textarea
                className="form-control"
                style={{ resize: 'both' }}
                readOnly
                ref={simulationPongTextAreaRef}
                value={formatSimulationPongs()}
              ></textarea>
            </div>
          </div>
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
