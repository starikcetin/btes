import React from 'react';
import { Table } from 'react-bootstrap';

import './LogTable.scss';
import { SimulationLog } from '../../state/simulation/SimulationLog';

interface LogTableProps {
  logs: SimulationLog[];
}

const LogTable: React.FC<LogTableProps> = (props) => {
  const { logs } = props;

  return (
    <Table striped size="sm">
      <colgroup>
        <col style={{ width: '33%' }} />
        <col style={{ width: '33%' }} />
        <col style={{ width: '33%' }} />
      </colgroup>
      <thead>
        <tr>
          <th>Time</th>
          <th>Event</th>
          <th>Direction</th>
          {/* <th>Payload</th> */}
        </tr>
      </thead>
      <tbody>
        {logs.map((log) => (
          <tr>
            <td>0</td>
            <td>{log.eventName}</td>
            <td>{log.direction}</td>
            {/* <td>
                  <div
                    style={{
                      overflowX: 'auto',
                      whiteSpace: 'nowrap',
                      maxWidth: '60%',
                    }}
                  >
                    {JSON.stringify(log.payload)}
                  </div>
                </td> */}
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export default LogTable;
