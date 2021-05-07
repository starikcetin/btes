import React, { useRef, useState } from 'react';
import Draggable, {
  DraggableData,
  DraggableEvent,
  DraggableEventHandler,
} from 'react-draggable';
import { animation, Item, Menu, theme, useContextMenu } from 'react-contexify';

import './SimulationNode.scss';
import nodeIcon from './pc.png';
import { NodeData } from '../../state/simulation/data/NodeData';
import { simulationBridge } from '../../services/simulationBridge';
import { nodeCardIdFormatter } from '../../utils/nodeIdFormatters';
import { hasValue } from '../../common/utils/hasValue';

interface SimulationNodeProps {
  simulationUid: string;
  data: NodeData;
  launchHandler: (nodeUid: string) => void;
  onDrag: DraggableEventHandler;
}

export const SimulationNode: React.FC<SimulationNodeProps> = (props) => {
  const {
    simulationUid,
    data: { nodeUid, positionY, positionX },
    launchHandler,
    onDrag,
  } = props;

  const draggableNodeRef = useRef<HTMLDivElement>(null);

  const contextMenuId = `comp-simulation-node--context-menu--${simulationUid}-${nodeUid}`;
  const { show: showContextMenu } = useContextMenu({
    id: contextMenuId,
  });

  const [isRenaming, setIsRenaming] = useState<boolean>(false);

  const updateNodePosition = (event: DraggableEvent, data: DraggableData) => {
    //this condition prevent to trigger this function when user does not move the node,
    // not trigger when doubleClick
    //TODO not clever solution, search new one
    if (positionX === data.x && positionY === data.y) return;
    //Send new position of the node
    simulationBridge.sendSimulationUpdateNodePosition(simulationUid, {
      nodeUid,
      positionX: data.x,
      positionY: data.y,
    });
  };

  const handleDoubleClick = () => {
    launchHandler(nodeUid);
  };

  const handleRename = () => {
    setIsRenaming(true);
  };

  const rename = () => {
    setIsRenaming(false);
  };

  const handleDeleteNode = () => {
    simulationBridge.sendSimulationDeleteNode(simulationUid, { nodeUid });
  };

  const onContextMenu = (event: React.MouseEvent) => {
    event.stopPropagation();
    event.preventDefault();
    showContextMenu(event);
  };

  return (
    <>
      <Draggable
        onStop={updateNodePosition}
        position={{ x: positionX, y: positionY }}
        nodeRef={draggableNodeRef}
        bounds="parent"
        onDrag={onDrag}
      >
        <div
          className="d-flex comp-simulation-node--node-card position-absolute justify-content-center align-items-center text-center"
          onDoubleClick={handleDoubleClick}
          ref={draggableNodeRef}
          onContextMenu={onContextMenu}
          id={nodeCardIdFormatter(simulationUid, nodeUid)}
        >
          <img
            className="comp-simulation-node--node-icon position-absolute"
            src={nodeIcon}
            alt="nodeIcon"
          />{' '}
          <span className="position-absolute comp-simulation-node--node-id text-truncate mb-3">
            {!isRenaming ? (
              hasValue(nodeUid.split('-')[0]) ? (
                nodeUid.split('-')[0]
              ) : (
                nodeUid
              )
            ) : (
              <div className="input-group comp-simulation-node--node-name-input">
                <input
                  type="text"
                  className="form-control comp-simulation-node--node-name-input"
                  placeholder="Name"
                />
                <div className="input-group-append">
                  <button
                    className="btn btn-success comp-simulation-node--node-name-input p-1"
                    type="button"
                    onClick={rename}
                  >
                    OK
                  </button>
                </div>
              </div>
            )}
          </span>
        </div>
      </Draggable>
      <Menu id={contextMenuId} theme={theme.light} animation={animation.fade}>
        <Item onClick={handleDeleteNode}>Delete Node</Item>
        <Item onClick={handleRename}>Rename</Item>
      </Menu>
    </>
  );
};
