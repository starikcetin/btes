import { useSelector } from 'react-redux';
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
  faFileExport,
  faNetworkWired,
  faPause,
  faPlay,
  faRedo,
  faSave,
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
import useForceUpdate from 'use-force-update';

import './Simulation.scss';
import { RootState } from '../../state/RootState';
import NodeModal from '../NodeModal/NodeModal';
import { simulationBridge } from '../../services/simulationBridge';
import { SimulationNode } from '../SimulationNode/SimulationNode';
import LogModal from '../LogModal/LogModal';
import { hasValue } from '../../common/utils/hasValue';
import { SimulationNodeConnection } from '../SimulationNodeConnection/SimulationNodeConnection';
import NodeConnectionModal from '../NodeConnectionModal/NodeConnectionModal';
import { NodeConnectionData } from '../../state/simulation/data/ConnectionData';
import { simulationInstanceService } from '../../services/simulationInstanceService';

interface SimulationProps {
  simulationUid: string;
}

export const Simulation: React.FC<SimulationProps> = (props) => {
  const { simulationUid } = props;

  const forceUpdate = useForceUpdate();
  const [shouldShowLogs, setShouldShowLogs] = useState(false);

  const boardContextMenuId = `comp-simulation--board-context-menu--${simulationUid}`;
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

  const allUniqueNodeConnections = useSelector((state: RootState) => {
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

  const [
    viewingConnectionFirstNodeUid,
    setViewingConnectionFirstNodeUid,
  ] = useState<string | null>(null);

  const [
    viewingConnectionSecondNodeUid,
    setViewingConnectionSecondNodeUid,
  ] = useState<string | null>(null);

  const setViewingConnection = (conn: NodeConnectionData | null) => {
    setViewingConnectionFirstNodeUid(conn?.firstNodeUid ?? null);
    setViewingConnectionSecondNodeUid(conn?.secondNodeUid ?? null);
  };

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

  const handleSave = useCallback(() => {
    simulationInstanceService.save(simulationUid);
  }, [simulationUid]);

  const handleExport = useCallback(() => {
    simulationInstanceService.openExportUrl(simulationUid);
  }, [simulationUid]);

  useEffect(() => {
    document.addEventListener('keyup', handleKeyUp);

    return () => {
      document.removeEventListener('keyup', handleKeyUp);
    };
  }, [handleKeyUp]);

  return (
    <div className="comp-simulation">
      <div className="comp-simulation--body">
        <div className="comp-simulation--toolbox bg-light border-bottom px-2">
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
              className="rounded-0 mr-4 comp-simulation--time-scale"
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
            <ButtonGroup className="ml-auto">
              <Button
                onClick={handleSave}
                variant="light"
                disabled={!isPaused}
                title={
                  isPaused
                    ? 'Save this simulation'
                    : 'Saving a running simulation is not supported. Pause first.'
                }
              >
                <FontAwesomeIcon icon={faSave} />
              </Button>
              <Button
                onClick={handleExport}
                variant="light"
                disabled={!isPaused}
                title={
                  isPaused
                    ? 'Export this simulation'
                    : 'Exporting a running simulation is not supported. Pause first.'
                }
              >
                <FontAwesomeIcon icon={faFileExport} />
              </Button>
            </ButtonGroup>
          </ButtonToolbar>
        </div>

        <div className="comp-simulation--board-container">
          <div
            className="comp-simulation--board"
            onContextMenu={onBoardContextMenu}
          >
            {nodes.map((node) => (
              <SimulationNode
                key={node.nodeUid}
                simulationUid={simulationUid}
                data={node}
                launchHandler={(nodeUid) => setViewingNodeUid(nodeUid)}
                onDrag={forceUpdate}
              ></SimulationNode>
            ))}
            {allUniqueNodeConnections.map((connection) => (
              <SimulationNodeConnection
                connection={connection}
                simulationUid={simulationUid}
                launchHandler={setViewingConnection}
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
      <NodeConnectionModal
        closeHandler={() => setViewingConnection(null)}
        simulationUid={simulationUid}
        firstNodeUid={viewingConnectionFirstNodeUid}
        secondNodeUid={viewingConnectionSecondNodeUid}
      />
      <div className="comp-simulation--sliding-panel">
        <div className="comp-simulation--sliding-panel--handle">
          <FontAwesomeIcon icon={faNetworkWired} />
        </div>
        <div className="comp-simulation--sliding-panel--body">
          Network Status: Online
        </div>
      </div>
    </div>
  );
};
