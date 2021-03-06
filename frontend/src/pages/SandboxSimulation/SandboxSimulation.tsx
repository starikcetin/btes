import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';
import React, { useCallback, useEffect, useState } from 'react';
import {
  Button,
  ButtonGroup,
  ButtonToolbar,
  FormControl,
  InputGroup,
} from 'react-bootstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faNetworkWired,
  faPause,
  faPlay,
  faRedo,
  faTachometerAlt,
  faUndo,
} from '@fortawesome/free-solid-svg-icons';
import {
  animation,
  Item,
  ItemParams,
  Menu,
  Separator,
  theme,
  useContextMenu,
} from 'react-contexify';
import _ from 'lodash';

import './SandboxSimulation.scss';
import { RootState } from '../../state/RootState';
import NodeModal from '../../components/NodeModal/NodeModal';
import { simulationBridge } from '../../services/simulationBridge';
import { SimulationNode } from '../../components/SimulationNode/SimulationNode';
import LogModal from '../../components/LogModal/LogModal';
import { hasValue } from '../../common/utils/hasValue';
import SimulationNodeConnection from '../../components/SimulationNodeConnection/SimulationNodeConnection';

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

  const isPaused = useSelector(
    (state: RootState) =>
      state.simulation[simulationUid]?.timerService.isPaused || false
  );

  const timeScale = useSelector((state: RootState) =>
    hasValue(state.simulation[simulationUid]?.timerService.timeScale)
      ? state.simulation[simulationUid]?.timerService.timeScale
      : 1
  );

  const allConnections = useSelector((state: RootState) => {
    const allConnections =
      state.simulation[simulationUid]?.connectionMap.connectionMap || {};

    const uniqueConnections = _.chain(allConnections)
      .flatMap((x) => _.values(x))
      .uniqBy((x) =>
        _.chain([x.firstNodeUid, x.secondNodeUid]).sort().join().value()
      )
      .value();

    return uniqueConnections;
  });

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

  const handleUndo = useCallback(() => {
    simulationBridge.sendSimulationUndo(simulationUid);
  }, [simulationUid]);

  const handleRedo = useCallback(() => {
    simulationBridge.sendSimulationRedo(simulationUid);
  }, [simulationUid]);

  const handlePauseOrResume = useCallback(() => {
    if (isPaused) {
      simulationBridge.sendSimulationResume(simulationUid);
    } else {
      simulationBridge.sendSimulationPause(simulationUid);
    }
  }, [isPaused, simulationUid]);

  const handleTimeScaleInputChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      let newValue = Number.parseFloat(e.target.value);
      if (!Number.isFinite(newValue) || newValue < 0) {
        newValue = 0;
      }

      simulationBridge.sendSimulationChangeTimeScale(simulationUid, {
        timeScale: newValue,
      });
    },
    [simulationUid]
  );

  const handleKeyUp = useCallback(
    (event: KeyboardEvent) => {
      if (event.ctrlKey && event.key === 'z') {
        handleUndo();
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      }

      if (event.ctrlKey && event.key === 'y') {
        handleRedo();
        event.preventDefault();
        event.stopImmediatePropagation();
        return false;
      }
    },
    [handleRedo, handleUndo]
  );

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);
    connect();

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
      teardown();
    };
  }, [connect, handleKeyUp, teardown]);

  //Sticky arrows between nodes
  const [, setRender] = useState({});
  const forceRerender = () => setRender({});

  return (
    <div className="page-sandbox-simulation">
      {connected ? (
        <>
          <div className="page-sandbox-simulation--body">
            <div className="page-sandbox-simulation--toolbox bg-light border-bottom pl-2">
              <ButtonToolbar>
                <ButtonGroup className="mr-4">
                  <Button
                    onClick={handleUndo}
                    variant="light"
                    className="rounded-0"
                    title="Undo"
                  >
                    <FontAwesomeIcon icon={faUndo} />
                  </Button>
                  <Button
                    onClick={handleRedo}
                    variant="light"
                    className="rounded-0"
                    title="Redo"
                  >
                    <FontAwesomeIcon icon={faRedo} />
                  </Button>
                </ButtonGroup>
                <ButtonGroup className="mr-4">
                  <Button
                    onClick={handlePauseOrResume}
                    variant="light"
                    className="rounded-0"
                    title={isPaused ? 'Resume' : 'Pause'}
                  >
                    <FontAwesomeIcon icon={isPaused ? faPlay : faPause} />
                  </Button>
                </ButtonGroup>
                <InputGroup
                  className="rounded-0 mr-4 page-sandbox-simulation--time-scale"
                  title="Time Scale"
                >
                  <InputGroup.Prepend>
                    <InputGroup.Text>
                      <FontAwesomeIcon icon={faTachometerAlt} />
                    </InputGroup.Text>
                  </InputGroup.Prepend>
                  <FormControl
                    type="number"
                    min={0}
                    value={timeScale}
                    onChange={handleTimeScaleInputChange}
                  />
                </InputGroup>
              </ButtonToolbar>
            </div>
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
                    forceRerender={forceRerender}
                  ></SimulationNode>
                ))}

                {allConnections.map((connection) => (
                  <SimulationNodeConnection
                    startRef={connection.firstNodeUid}
                    endRef={connection.secondNodeUid}
                    simulationUid={simulationUid}
                  />
                ))}
              </div>
            </div>
          </div>
          <Menu
            id={boardContextMenuId}
            theme={theme.light}
            animation={animation.fade}
          >
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
