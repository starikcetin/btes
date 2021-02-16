import React, { useState } from 'react';
import { Button, Col, Container, Form, Row, Table } from 'react-bootstrap';
import { useSelector } from 'react-redux';

import './NodeMailsDashboard.scss';
import { RootState } from '../../state/RootState';
import { SaneSelect } from '../SaneSelect/SaneSelect';

interface NodeMailsDashboardProps {
  simulationUid: string;
  nodeUid: string | null;
}

export const NodeMailsDashboard: React.FC<NodeMailsDashboardProps> = (
  props
) => {
  const { simulationUid, nodeUid } = props;
  const [isBroadcast, setIsBroadcast] = useState<boolean>(false);
  const [shouldPropagate, setShouldPropagate] = useState<boolean>(true);
  const [recipientNodeUid, setRecipientNodeUid] = useState<string | null>(null);
  const [mailBody, setMailBody] = useState<string>();

  const receivedMails = useSelector((state: RootState) => {
    return nodeUid
      ? state.simulation[simulationUid].nodeMap[nodeUid].receivedMails
      : [];
  });

  const recipientNodeUids = useSelector((state: RootState) => {
    return nodeUid
      ? state.simulation[simulationUid].nodeMap[nodeUid].connectedNodeUids
      : [];
  });

  const makeRecipientNodeSelectOptions = (recipientNodeUids: string[]) =>
    recipientNodeUids.map((recipientNodeUid) => ({
      value: recipientNodeUid,
      label: recipientNodeUid,
    }));

  const canSend = isBroadcast || null !== recipientNodeUid;

  const send = () => {
    console.log('send message', {
      isBroadcast,
      shouldPropagate,
      recipientNodeUid,
      mailBody,
    });
  };

  return (
    <Container className="comp-node-mails-dashboard">
      <Row>
        <Col>Send Mail</Col>
      </Row>
      <Form
        onSubmit={(e: React.FormEvent<HTMLFormElement>) => {
          e.preventDefault();
          e.stopPropagation();
        }}
      >
        <Row>
          <Col>
            <Form.Control
              className="comp-node-mails-dashboard--body-textarea"
              as="textarea"
              placeholder="Enter the mail body here..."
              onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) =>
                setMailBody(e.target.value)
              }
            />
          </Col>
          <Col>
            <Row>
              <Col>
                <Form.Group>
                  <Form.Check
                    label="Broadcast"
                    type="checkbox"
                    checked={isBroadcast}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setIsBroadcast(e.target.checked)
                    }
                  />
                </Form.Group>
              </Col>
              <Col>
                <Form.Group hidden={!isBroadcast}>
                  <Form.Check
                    label="Propagate"
                    type="checkbox"
                    checked={shouldPropagate}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setShouldPropagate(e.target.checked)
                    }
                  />
                  <Form.Text>
                    If enabled, receiver nodes will relay the broadcast to other
                    nodes.
                  </Form.Text>
                </Form.Group>
                <Form.Group hidden={isBroadcast}>
                  <Form.Label>Recipient Node</Form.Label>
                  <SaneSelect
                    options={makeRecipientNodeSelectOptions(recipientNodeUids)}
                    onChange={(opt) => setRecipientNodeUid(opt?.value || null)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Row>
              <Col>
                <Button
                  variant="success"
                  type="button"
                  onClick={send}
                  disabled={!canSend}
                >
                  Send
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>
      </Form>
      <Row>
        <Col>Received Mails</Col>
      </Row>
      <Row>
        <Col>
          <Table striped bordered hover>
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Origin Node UID</th>
                <th style={{ width: '20%' }}>Mail UID</th>
                <th style={{ width: '60%' }}>Mail Body</th>
              </tr>
            </thead>
            <tbody>
              {receivedMails.length === 0 ? (
                <tr>
                  <td colSpan={3}>No mails received yet.</td>
                </tr>
              ) : (
                receivedMails.map((mail) => (
                  <tr key={mail.mailUid}>
                    <td>{mail.originNodeUid}</td>
                    <td>{mail.mailUid}</td>
                    <td>{mail.body}</td>
                  </tr>
                ))
              )}
            </tbody>
          </Table>
        </Col>
      </Row>
    </Container>
  );
};
