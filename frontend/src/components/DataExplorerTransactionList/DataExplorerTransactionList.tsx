import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import LoaderMask from '../LoaderMask/LoaderMask';
import { fetchTransactionList, Tx } from '../../apis/TransactionList';
import { formatTimestampForTimeInput } from '../../utils/formatTimestampForTimeInput';

const DataExplorerBlockList: React.FC = () => {
  const [data, setData] = useState<Tx[] | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

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
                {data.slice(0, 6).map((tx) => (
                  <tr className="row" key={tx.hash}>
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
