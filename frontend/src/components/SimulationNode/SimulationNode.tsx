import React, { useRef } from 'react';
import { ContextMenuTrigger, ContextMenu, MenuItem } from 'react-contextmenu';
import Draggable, { DraggableData, DraggableEvent } from 'react-draggable';
import { simulationBridge } from '../../services/simulationBridge';
import { NodeData } from '../../state/simulation/NodeData';

import './SimulationNode.scss';

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

  const contextMenuId = `nodeRightClickArea_${nodeUid}`;

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

  const handleDeleteNode = (event: React.UIEvent) => {
    event.preventDefault();
    event.stopPropagation();
    simulationBridge.sendSimulationDeleteNode(simulationUid, { nodeUid });
  };

  return (
    <div className="simulation-node">
      <ContextMenuTrigger id={contextMenuId} holdToDisplay={-1}>
        <Draggable
          onStop={updateNodePosition}
          position={{ x: positionX, y: positionY }}
          nodeRef={draggableNodeRef}
        >
          <div
            className="node-card card position-absolute justify-content-center"
            onDoubleClick={handleDoubleClick}
            ref={draggableNodeRef}
          >
            <span className="alert-info">NODE</span>
            <p className="card-text text-center">{nodeUid}</p>
          </div>
        </Draggable>
      </ContextMenuTrigger>
      <ContextMenu id={`nodeRightClickArea_${nodeUid}`}>
        <MenuItem data={{ event: 'deleteNode' }} onClick={handleDeleteNode}>
          <span className="menu-item bg-success border p-2">Delete Node</span>
        </MenuItem>
      </ContextMenu>
    </div>
  );
};
