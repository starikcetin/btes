import React, { useRef } from 'react';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { animation, Item, Menu, theme, useContextMenu } from 'react-contexify';

import './SimulationNode.scss';
// import nodeIcon from './pcIcon.png';
import { NodeData } from '../../state/simulation/NodeData';
import { simulationBridge } from '../../services/simulationBridge';

interface SimulationNodeProps {
  simulationUid: string;
  data: NodeData;
  launchHandler: (nodeUid: string) => void;
}

export const SimulationNode: React.FC<SimulationNodeProps> = (props) => {
  const {
    simulationUid,
    data: { nodeUid, positionY, positionX },
    launchHandler,
  } = props;
  const draggableNodeRef = useRef<HTMLDivElement>(null);

  const contextMenuId = `comp-simulation-node--context-menu--${simulationUid}-${nodeUid}`;
  const { show: showContextMenu } = useContextMenu({
    id: contextMenuId,
  });

  const updateNodePosition = (event: DraggableEvent, data: DraggableData) => {
    simulationBridge.sendSimulationUpdateNodePosition(simulationUid, {
      nodeUid,
      positionX: data.x,
      positionY: data.y,
    });
  };

  const handleDoubleClick = () => {
    launchHandler(nodeUid);
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
      >
        <div
          className="comp-simulation-node--node-card card position-absolute justify-content-center"
          onDoubleClick={handleDoubleClick}
          ref={draggableNodeRef}
          onContextMenu={onContextMenu}
        >
          <span className="alert-info">NODE</span>
          <p className="card-text text-center">{nodeUid}</p>
        </div>
      </Draggable>
      <Menu id={contextMenuId} theme={theme.light} animation={animation.fade}>
        <Item onClick={handleDeleteNode}>Delete Node</Item>
      </Menu>
    </>
  );
};
