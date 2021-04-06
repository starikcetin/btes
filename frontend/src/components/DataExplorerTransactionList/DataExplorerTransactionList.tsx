import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import LoaderMask from '../LoaderMask/LoaderMask';
import { fetchTransactionList, Tx } from '../../apis/TransactionList';

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
  }, []);
  return (
    <div>
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
            <Table
              borderless
              hover
              className="comp-data-explorer-block-list-table"
            >
              <thead>
                <tr className="comp-data-explorer-block-list-table-header-row row">
                  <th className="col-4">Hash</th>
                  <th className="col-2">Tx Status</th>
                  <th className="col-1">Tx Type</th>
                  <th className="col-4">Amount</th>
                </tr>
              </thead>
              <tbody>
                {data
                  .filter((tx) => {
                    return tx.tx_type === 'token_transfer';
                  })
                  .slice(0, 6)
                  .map((tx) => (
                    <tr className="row" key={tx.tx_id}>
                      <td className="col-4 text-truncate">{tx.tx_id}</td>
                      <td className="col-2">{tx.tx_status}</td>
                      <td className="col-1">{tx.tx_type}</td>
                      <td className="col-4 text-truncate ml-1">
                        {tx?.token_transfer?.amount}
                      </td>
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
