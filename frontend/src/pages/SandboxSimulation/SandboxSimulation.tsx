import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import { Card } from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faNetworkWired } from '@fortawesome/free-solid-svg-icons';
import {
  Item,
  ItemParams,
  Menu,
  Separator,
  theme,
  useContextMenu,
} from 'react-contexify';

import './SandboxSimulation.scss';
import { RootState } from '../../state/RootState';
import NodeModal from '../../components/NodeModal/NodeModal';
import { simulationBridge } from '../../services/simulationBridge';
import { SimulationNode } from '../../components/SimulationNode/SimulationNode';
import LogModal from '../../components/LogModal/LogModal';

interface SandboxSimulationParamTypes {
  simulationUid: string;
}

const SandboxSimulation: React.FC = () => {
  const [connected, setConnected] = useState(false);
  const [shouldShowLogs, setShouldShowLogs] = useState(false);
  const { simulationUid } = useParams<SandboxSimulationParamTypes>();

  const boardContextMenuId = `page-sandbox-simulation--board-context-menu--${simulationUid}`;
  const { show: showBoardContextMenu } = useContextMenu({
    id: boardContextMenuId,
  });

  const nodes = useSelector((state: RootState) =>
    Object.values(state.simulation[simulationUid]?.nodeMap || {})
  );

  const logs = useSelector((state: RootState) =>
    Object.values(state.simulation[simulationUid]?.logs || [])
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

  const createNode = ({ triggerEvent }: ItemParams) => {
    simulationBridge.sendSimulationCreateNode(simulationUid, {
      // `offsetX` and `offsetY` are experimental. API ref:
      // https://developer.mozilla.org/en-US/docs/Web/API/MouseEvent/offsetX
      positionX: triggerEvent.offsetX,
      positionY: triggerEvent.offsetY,
    });
  };

  const showLogsOnClick = () => {
    setShouldShowLogs(true);
  };

  const onBoardContextMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    showBoardContextMenu(event);
  };

  useEffect(() => {
    connect();

    return () => {
      teardown();
    };
  }, [connect, teardown]);

  return (
    <div className="page-sandbox-simulation">
      {connected ? (
        <>
          <div className="page-sandbox-simulation--board-container">
            <div
              className="page-sandbox-simulation--board"
              onContextMenu={onBoardContextMenu}
            >
              {nodes.map((node) => (
                <SimulationNode
                  key={node.nodeUid}
                  simulationUid={simulationUid}
                  data={node}
                  launchHandler={(nodeUid) => setViewingNodeUid(nodeUid)}
                ></SimulationNode>
              ))}
            </div>
          </div>
          <Menu id={boardContextMenuId} theme={theme.light}>
            <Item onClick={createNode}>Create Node</Item>
            <Separator />
            <Item onClick={sendSimulationPingOnClick}>Send Ping</Item>
            <Item onClick={showLogsOnClick}>Show Logs</Item>
          </Menu>
          <NodeModal
            closeHandler={() => setViewingNodeUid(null)}
            simulationUid={simulationUid}
            nodeUid={viewingNodeUid}
          />
          <LogModal
            closeHandler={() => setShouldShowLogs(false)}
            logs={logs}
            show={shouldShowLogs}
          />
          <div className="page-sandbox-simulation--sliding-panel">
            <div className="page-sandbox-simulation--sliding-panel--handle">
              <FontAwesomeIcon icon={faNetworkWired} />
            </div>
            <div className="page-sandbox-simulation--sliding-panel--body">
              Network Status: Online
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
