import React, { useCallback, useState } from 'react';
import { Button, Col, ListGroup, Row, Spinner } from 'react-bootstrap';
import { SimulationSaveMetadata } from '../../../../backend/src/common/saveLoad/SimulationSaveMetadata';
import { simulationInstanceService } from '../../services/simulationInstanceService';
import { RelativeDate } from '../RelativeDate/RelativeDate';

interface SimulationSaveListItemProps {
  metadata: SimulationSaveMetadata;
  /** Called when a join button is clicked. Provide a function that handles joining. */
  joinHandler: (simulationUid: string) => Promise<void>;
  /** Called after a load operation is successfully over. */
  onLoadSuccess: () => Promise<void>;
}

export const SimulationSaveListItem: React.FC<SimulationSaveListItemProps> = (
  props
) => {
  const { metadata, joinHandler, onLoadSuccess } = props;

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleLoadSimulation = useCallback(async () => {
    try {
      setIsLoading(true);
      await simulationInstanceService.load(metadata.documentId);
      await onLoadSuccess();
    } finally {
      setIsLoading(false);
    }
  }, [metadata.documentId, onLoadSuccess]);

  const handleJoinSimulation = useCallback(async () => {
    try {
      setIsLoading(true);
      await joinHandler(metadata.simulationUid);
    } finally {
      setIsLoading(false);
    }
  }, [joinHandler, metadata.simulationUid]);

  return (
    <ListGroup.Item key={metadata.documentId}>
      <Row>
        <Col xs={12} xl>
          <Row>
            <Col>Simulation UID: {metadata.simulationUid}</Col>
          </Row>
          <Row>
            <Col>
              <span className="small text-muted">
                Last change: <RelativeDate date={metadata.lastUpdate} />
              </span>
            </Col>
          </Row>
        </Col>
        <Col
          xs={12}
          xl="auto"
          className="d-flex align-items-center justify-content-end"
        >
          <Button
            variant={metadata.isActive ? 'success' : 'primary'}
            onClick={
              metadata.isActive ? handleJoinSimulation : handleLoadSimulation
            }
            disabled={isLoading}
          >
            {isLoading && (
              <Spinner as="span" animation="grow" size="sm" className="mr-2" />
            )}
            <span>{metadata.isActive ? 'Join' : 'Load'}</span>
          </Button>
        </Col>
      </Row>
    </ListGroup.Item>
  );
};
