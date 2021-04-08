import React from 'react';
//scss
import './DataExplorerBlockTransactionCard.scss';
import { BlockTx } from '../../apis/SingleBlockAPI';
import { formatTimestampForTimeInput } from '../../utils/formatTimestampForTimeInput';
import { formatNumberToBitcoin } from '../../utils/formatNumberToBitcoin';
import { Table } from 'react-bootstrap';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom';

interface DataExplorerBlockTransactionCardProps {
  tx: BlockTx;
}

const calculateTotalInputValue = (tx: BlockTx) => {
  let total = 0;
  tx.inputs.map(
    (input) => (total += input.prev_out ? input.prev_out.value : 0)
  );
  return total;
};

const calculateTotalOutValue = (tx: BlockTx) => {
  let total = 0;
  tx.out.map((out) => (total += out.value ? out.value : 0));
  return total;
};

const DataExplorerBlockTransactionCard: React.FC<DataExplorerBlockTransactionCardProps> = (
  props
) => {
  const { tx } = props;
  const totalInput = calculateTotalInputValue(tx);
  const totalOut = calculateTotalOutValue(tx);
  return (
    <div className="container p-5 comp-data-explorer-block-transaction-card-container">
      <div className="row d-flex justify-content-between text-secondary mb-2 border p-4">
        <div className="col-10 text-truncate text-left">
          <span className="mr-4">Hash</span>
          <Link to={tx.hash}>{tx.hash}</Link>
        </div>
        <div className="col-2 text-right">
          {formatTimestampForTimeInput(tx.time)}
        </div>
      </div>
      <div className="row">
        <div className="col-5">
          <Table>
            {tx.inputs.map((input) => (
              <tr className="row">
                <td className="col-8 text-truncate text-muted">
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
          </Table>
        </div>
        <div className="col-1 d-flex justify-content-center align-items-center">
          <FontAwesomeIcon icon={faArrowRight} size="3x" />
        </div>
        <div className="col-5">
          <Table>
            {tx.out.map((out) => (
              <tr className="row">
                <td className="col-8 text-truncate text-muted">{out.addr}</td>
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
          </Table>
        </div>
      </div>
      <div className="row d-flex align-items-center">
        <div className="col-6 text-left text-muted h6">
          <span className="mr-5">Fee</span>
          <span>
            {formatNumberToBitcoin(
              totalInput - totalOut < 0 ? 0 : totalInput - totalOut
            )}
          </span>
        </div>
        <div className="col-6 text-right h6">
          <span className="mr-4 btn btn-outline-success disabled ">
            {formatNumberToBitcoin(totalOut)}
          </span>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default DataExplorerBlockTransactionCard;
