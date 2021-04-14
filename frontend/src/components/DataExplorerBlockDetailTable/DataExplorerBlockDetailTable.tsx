import React from 'react';
import { Block } from '../../services/explorer/SingleBlockAPI';
import { Table } from 'react-bootstrap';
import { formatTimestampForTimeInput } from '../../utils/formatTimestampForTimeInput';
import { formatNumberToBitcoin } from '../../utils/formatNumberToBitcoin';
//scss
import './DataExplorerBlockDetailTable.scss';

interface DataExplorerBlockTableProps {
  data: Block;
}

const DataExplorerBlockDetailTable: React.FC<DataExplorerBlockTableProps> = (
  props
) => {
  const { data } = props;
  return (
    <div className="container d-flex justify-content-center comp-data-explorer-block-table-table-container">
      <Table hover>
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
            <td className="col-4">Height</td>
            <td className="col-8">{data.height}</td>
          </tr>
          <tr className="row">
            <td className="col-4">Tx Count</td>
            <td className="col-8">{data.tx.length}</td>
          </tr>
          <tr className="row">
            <td className="col-4">Merkle Root</td>
            <td className="col-8">{data.mrkl_root}</td>
          </tr>
          <tr className="row">
            <td className="col-4">Version</td>
            <td className="col-8">{data.ver}</td>
          </tr>
          <tr className="row">
            <td className="col-4">Bit Count</td>
            <td className="col-8">{data.bits}</td>
          </tr>
          <tr className="row">
            <td className="col-4">Size</td>
            <td className="col-8">{data.size} Bytes</td>
          </tr>
          <tr className="row">
            <td className="col-4">Nonce</td>
            <td className="col-8">{data.nonce}</td>
          </tr>
          <tr className="row">
            <td className="col-4">Fee Reward</td>
            <td className="col-8">{formatNumberToBitcoin(data.fee)}</td>
          </tr>
        </tbody>
      </Table>
    </div>
  );
};

export default DataExplorerBlockDetailTable;
