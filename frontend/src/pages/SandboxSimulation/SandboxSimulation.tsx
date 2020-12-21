import React, { useCallback, useEffect, useRef, useState } from 'react';
import './SandboxSimulation.scss';
import { useParams } from 'react-router-dom';
import { simulationBridge } from '../../services/simulationBridge';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../state/RootState';
import { ContextMenu, ContextMenuTrigger, MenuItem } from 'react-contextmenu';
import { SimulationNodePayload } from '../../state/simulation/SimulationNodePayload';
import NodeModal from '../../components/NodeModal/NodeModal';
import { simulationSlice } from '../../state/simulation/simulationSlice';
// import nodeIcon from './pcIcon.png';

interface SandboxSimulationParamTypes {
  simulationUid: string;
}

const SandboxSimulation: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const simulationPongTextAreaRef = useRef<HTMLTextAreaElement>(null);
  const { simulationUid } = useParams<SandboxSimulationParamTypes>();
  const simulationPongs = useSelector(
    (state: RootState) => state.simulation[simulationUid]?.pongs
  );
  const nodes = useSelector(
    (state: RootState) => state.simulation[simulationUid]?.nodes
  );
  const [viewingNode, setViewingNode] = useState<SimulationNodePayload | null>(
    null
  );
  const dispatch = useDispatch();

  const connect = useCallback(async () => {
    await simulationBridge.connect(simulationUid);
    setConnected(true);
  }, [simulationUid]);

  const teardown = useCallback(() => {
    const action = simulationSlice.actions.teardown({ simulationUid });
    dispatch(action);
  }, [dispatch, simulationUid]);

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
      positionY: event.pageY,
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
            <ContextMenuTrigger id="rightClickArea">
              <div className="d-flex position-absolute h-75 border w-100">
                {nodes.map((node) => {
                  const style = {
                    top: node.positionY - 50, //from element height
                    left: node.positionX,
                    cursor: 'pointer',
                  };
                  return (
                    <div
                      className="card position-absolute d-flex justify-content-center"
                      style={style}
                      onClick={() => setViewingNode(node)}
                      key={node.nodeUid}
                    >
                      <span className="alert-info">NODE</span>
                      <p className="card-text text-center">{node.nodeUid}</p>
                    </div>
                  );
                })}
              </div>
            </ContextMenuTrigger>
            <ContextMenu id="rightClickArea">
              <MenuItem data={{ event: 'createNode' }} onClick={createNode}>
                <span className="menu-item bg-success border p-2">
                  Create Node
                </span>
              </MenuItem>
            </ContextMenu>
            {viewingNode && (
              <NodeModal
                show={true}
                closeHandler={() => setViewingNode(null)}
                node={viewingNode}
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
