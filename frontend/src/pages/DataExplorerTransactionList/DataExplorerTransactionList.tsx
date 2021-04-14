import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import LoaderMask from '../../components/LoaderMask/LoaderMask';
import {
  fetchTransactionList,
  Tx,
} from '../../services/explorer/TransactionList';
import { formatTimestampForTimeInput } from '../../utils/formatTimestampForTimeInput';
import { Link, useParams } from 'react-router-dom';
import DataExplorerTransactionModal from '../../components/explorer/DataExplorerTransactionModal/DataExplorerTransactionModal';

interface DataExplorerTransactionListParams {
  isFull: string;
}

const DataExplorerBlockList: React.FC = () => {
  const { isFull } = useParams<DataExplorerTransactionListParams>();
  const [data, setData] = useState<Tx[] | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [viewingTransaction, setViewingTransaction] = useState<string | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const transactionList = await fetchTransactionList();
        setData(transactionList);
        setIsFetching(false);
      } catch (e) {
        console.log(e);
        setIsFetching(false);
        setData(null);
      }
    };
    fetchData();
    setInterval(async () => {
      try {
        const transactionList = await fetchTransactionList();
        setData(transactionList);
      } catch (e) {
        console.log(e);
      }
    }, 10000);
  }, []);
  return (
    <div className="container">
      <DataExplorerTransactionModal
        closeHandler={() => setViewingTransaction(null)}
        transactionHash={viewingTransaction}
      />
      {isFetching ? (
        <LoaderMask></LoaderMask>
      ) : (
        <div>
          <div>
            <span className="h4 text-info d-block">Latest Transactions</span>
            <span className="text-secondary d-block small">
              The most recently published unconfirmed transactions
            </span>
          </div>
          {data ? (
            <div>
              <Table hover className="comp-data-explorer-block-list-table">
                <thead>
                  <tr className="comp-data-explorer-block-list-table-header-row row">
                    <th className="col-4">Hash</th>
                    <th className="col-2">Time</th>
                    <th className="col-2">Size</th>
                    <th className="col-4">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  {isFull
                    ? data.map((tx) => (
                        <tr
                          className="row comp-data-explorer-block-list-table-body-row"
                          key={tx.hash}
                          onClick={() => {
                            setViewingTransaction(tx.hash);
                          }}
                        >
                          <td className="col-4 text-truncate">{tx.hash}</td>
                          <td className="col-2">
                            {formatTimestampForTimeInput(tx.time)}
                          </td>
                          <td className="col-2">{tx.size} Byte</td>
                          <td className="col-4 text-truncate">{tx.weight}</td>
                        </tr>
                      ))
                    : data.slice(0, 6).map((tx) => (
                        <tr
                          className="row comp-data-explorer-block-list-table-body-row"
                          key={tx.hash}
                          onClick={() => {
                            setViewingTransaction(tx.hash);
                          }}
                        >
                          <td className="col-4 text-truncate">{tx.hash}</td>
                          <td className="col-2">
                            {formatTimestampForTimeInput(tx.time)}
                          </td>
                          <td className="col-2">{tx.size} Byte</td>
                          <td className="col-4 text-truncate">{tx.weight}</td>
                        </tr>
                      ))}
                </tbody>
              </Table>
              {isFull ? (
                <></>
              ) : (
                <Link
                  to="/explorer-transactions/full"
                  className="btn btn-outline-primary mb-3"
                >
                  All Transactions
                </Link>
              )}
            </div>
          ) : (
            <span className="alert-danger">
              Transaction List Couldn't Downloaded!
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DataExplorerBlockList;
