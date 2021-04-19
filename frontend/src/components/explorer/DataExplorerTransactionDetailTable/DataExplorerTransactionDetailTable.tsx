import React from 'react';
import { Table } from 'react-bootstrap';

import './DataExplorerTransactionDetailTable.scss';
import { formatTimestampForTimeInput } from '../../../utils/formatTimestampForTimeInput';
import { formatNumberToBitcoin } from '../../../utils/formatNumberToBitcoin';
import { DataExplorerTransaction } from '../../../services/explorer/data/transaction/DataExplorerTransaction';

interface DataExplorerBlockTableProps {
  data: DataExplorerTransaction;
}

const DataExplorerTransactionDetailTable: React.FC<DataExplorerBlockTableProps> = (
  props
) => {
  const { data } = props;
  return (
    <div className="container d-flex justify-content-center comp-data-explorer-transaction-detail-table">
      <Table hover>
        <thead>
          <tr>
            <div className="h4 row">Transaction Details</div>
          </tr>
        </thead>
        <tbody className="text-secondary">
          <tr className="row">
            <td className="col-4">Hash</td>
            <td className="col-8">{data.hash}</td>
          </tr>
          <tr className="row">
            <td className="col-4">Time Stamp</td>
            <td className="col-8">{formatTimestampForTimeInput(data.time)}</td>
          </tr>
          <tr className="row">
            <td className="col-4">Size</td>
            <td className="col-8">{data.size}</td>
          </tr>
          <tr className="row">
            <td className="col-4">Weight</td>
            <td className="col-8">{data.weight}</td>
          </tr>
          <tr className="row">
            <td className="col-4">Fee</td>
            <td className="col-8">{formatNumberToBitcoin(data.fee)}</td>
          </tr>
          <tr className="row">
            <td className="col-4">Version</td>
            <td className="col-8">{data.ver}</td>
          </tr>
          <tr className="row">
            <td className="col-4">Included In Block</td>
            <td className="col-8">{data.block_height}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default DataExplorerTransactionDetailTable;
