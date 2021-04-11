import React, { useState } from 'react';
import { Input, Out } from '../../apis/SingleTransactionAPI';
import { Table } from 'react-bootstrap';
import './DataExplorerTransactionInputOutputDetail.scss';
import { formatNumberToBitcoin } from '../../utils/formatNumberToBitcoin';
import DataExplorerAddressDetailModal from '../DataExplorerAddressDetailModal/DataExplorerAddressDetailModal';

interface DataExplorerTransactionInputOutputDetailProps {
  inputs: Input[];
  outputs: Out[];
}

const DataExplorerTransactionInputOutputDetail: React.FC<DataExplorerTransactionInputOutputDetailProps> = (
  props
) => {
  const { inputs, outputs } = props;
  const [viewingAddress, setViewingAddress] = useState<string | null>(null);
  return (
    <div className="container comp-data-explorer-transaction-input-output-detail-container">
      <DataExplorerAddressDetailModal
        closeHandler={() => setViewingAddress(null)}
        address={viewingAddress}
      />
      <div className="h4">Inputs</div>
      {inputs.map((input) => (
        <Table hover borderless className="mb-5">
          <tbody className="text-secondary">
            <tr className="row">
              <td className="  col-2">Index</td>
              <td className="col-4">{input.index}</td>

              <td className="text-right  col-2">Value</td>
              <td className="col-4">
                {formatNumberToBitcoin(input?.prev_out?.value)}
              </td>
            </tr>
            <tr className="row">
              <td className="col-2">Address</td>
              <td
                className="col-10 text-info"
                onClick={() => {
                  setViewingAddress(
                    input.prev_out?.addr ? input.prev_out.addr : null
                  );
                }}
              >
                {input?.prev_out?.addr}
              </td>
            </tr>
            <tr className="row">
              <td className="  col-2">Script</td>
              <td className="col-10 text-break">{input.script}</td>
            </tr>
            <tr className="row">
              <td className="col-2">Witness</td>
              <td className="col-9 text-break">{input.witness}</td>
            </tr>
          </tbody>
        </Table>
      ))}
      <div className="h4">Outs</div>
      {outputs.map((out) => (
        <Table hover borderless className="mb-5">
          <tbody className="text-secondary">
            <tr className="row">
              <td className="col-2">Index</td>
              <td className="col-4">{out.n}</td>
              <td className="text-right  col-2">Detail</td>
              <td className="col-4">
                {out.spent ? (
                  <span className="text-danger">Spent</span>
                ) : (
                  <span className="text-success">Spent</span>
                )}
              </td>
            </tr>
            <tr className="row">
              <td className="col-2">Address</td>
              <td
                className="col-4 text-info"
                onClick={() => {
                  setViewingAddress(out?.addr ? out.addr : null);
                }}
              >
                {out.addr}
              </td>
              <td className="text-right col-2">Value</td>
              <td className="col-4">{formatNumberToBitcoin(out.value)}</td>
            </tr>
            <tr className="row">
              <td className="col-2">Script</td>
              <td className="col-10 text-break">{out.script}</td>
            </tr>
          </tbody>
        </Table>
      ))}
    </div>
  );
};

export default DataExplorerTransactionInputOutputDetail;
