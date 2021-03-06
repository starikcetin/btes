import React, { useState } from 'react';
import { Table } from 'react-bootstrap';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './DataExplorerBlockTransactionCard.scss';
import { formatTimestampForTimeInput } from '../../../utils/formatTimestampForTimeInput';
import { formatNumberToBitcoin } from '../../../utils/formatNumberToBitcoin';
import DataExplorerTransactionModal from '../DataExplorerTransactionModal/DataExplorerTransactionModal';
import DataExplorerAddressDetailModal from '../DataExplorerAddressDetailModal/DataExplorerAddressDetailModal';
import { DataExplorerTransaction } from '../../../services/explorer/data/transaction/DataExplorerTransaction';

interface DataExplorerBlockTransactionCardProps {
  tx: DataExplorerTransaction;
}

const calculateTotalInputValue = (tx: DataExplorerTransaction) => {
  let total = 0;
  tx.inputs.map(
    (input) => (total += input.prev_out ? input.prev_out.value : 0)
  );
  return total;
};

const calculateTotalOutValue = (tx: DataExplorerTransaction) => {
  let total = 0;
  tx.out.map((out) => (total += out.value ? out.value : 0));
  return total;
};

const DataExplorerBlockTransactionCard: React.FC<DataExplorerBlockTransactionCardProps> = (
  props
) => {
  const { tx } = props;
  const [viewingTransaction, setViewingTransaction] = useState<string | null>(
    null
  );
  const [viewingAddress, setViewingAddress] = useState<string | null>(null);
  const totalInput = calculateTotalInputValue(tx);
  const totalOut = calculateTotalOutValue(tx);
  return (
    <div className="container p-5 comp-data-explorer-block-transaction-card">
      <DataExplorerTransactionModal
        closeHandler={() => setViewingTransaction(null)}
        transactionHash={viewingTransaction}
      />
      <DataExplorerAddressDetailModal
        closeHandler={() => setViewingAddress(null)}
        address={viewingAddress}
      />
      <div className="row d-flex justify-content-between text-secondary mb-2 h6 p-4">
        <div className="col-10 text-truncate text-left">
          <span className="mr-4">Hash</span>
          <span
            className="text-primary comp-data-explorer-block-transaction-card--header-hash-span"
            onClick={() => {
              setViewingTransaction(tx.hash);
            }}
          >
            {tx.hash}
          </span>
        </div>
        <div className="col-2 text-right">
          {formatTimestampForTimeInput(tx.time)}
        </div>
        <hr />
      </div>
      <div className="row">
        <div className="col-5">
          <Table>
            <tbody>
              {tx.inputs.map((input) => (
                <tr className="row" key={input.index}>
                  <td
                    className="col-8 text-truncate text-secondary comp-data-explorer-block-transaction-card--address-td"
                    onClick={() => {
                      setViewingAddress(
                        input.prev_out?.addr ? input.prev_out.addr : null
                      );
                    }}
                  >
                    {input.prev_out?.addr}
                  </td>
                  <td className="col-4">
                    {input.prev_out?.spent ? (
                      <span className="text-danger">
                        {formatNumberToBitcoin(input.prev_out?.value)}
                      </span>
                    ) : (
                      <span className="text-success">
                        {formatNumberToBitcoin(input.prev_out?.value)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
        <div className="col-1 d-flex justify-content-center align-items-center">
          <FontAwesomeIcon icon={faArrowRight} size="3x" />
        </div>
        <div className="col-5">
          <Table>
            <tbody>
              {tx.out.map((out) => (
                <tr className="row" key={out.addr}>
                  <td
                    className="col-8 text-truncate text-secondary comp-data-explorer-block-transaction-card--address-td"
                    onClick={() => {
                      setViewingAddress(out?.addr ? out.addr : null);
                    }}
                  >
                    {out.addr}
                  </td>
                  <td className="col-4">
                    {out.spent ? (
                      <span className="text-danger">
                        {formatNumberToBitcoin(out.value)}
                      </span>
                    ) : (
                      <span className="text-success">
                        {formatNumberToBitcoin(out.value)}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      </div>
      <div className="row d-flex align-items-center">
        <div className="col-6 text-left text-muted h6">
          {tx.fee === 0 ? (
            <span className="mr-5">COINBASE (Newly Generated Coins)</span>
          ) : (
            <div>
              <span className="mr-5">Fee</span>
              <span>{formatNumberToBitcoin(tx.fee)}</span>
            </div>
          )}
        </div>
        <div className="col-6 text-right h6">
          <span className="mr-4 btn btn-outline-success disabled ">
            {formatNumberToBitcoin(totalOut)}
          </span>
          {tx.block_height ? (
            <></>
          ) : (
            <span className="btn btn-outline-danger disabled ">
              UNCONFIRMED
            </span>
          )}
        </div>
      </div>
      <hr />
    </div>
  );
};

export default DataExplorerBlockTransactionCard;
