import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'react-bootstrap';
import Pagination from '@vlsergey/react-bootstrap-pagination';

import LoaderMask from '../../LoaderMask/LoaderMask';
import { formatNumberToBitcoin } from '../../../utils/formatNumberToBitcoin';
import { fetchAddressDetail } from '../../../services/explorer/AddressAPI';
import DataExplorerBlockTransactionCard from '../DataExplorerBlockTransactionCard/DataExplorerBlockTransactionCard';
import { DataExplorerAddressBalance } from '../../../services/explorer/data/address/DataExplorerAddressBalance';
import { hasValue } from '../../../common/utils/hasValue';

interface DataExplorerAddressDetailModalProps {
  closeHandler: () => void;
  address: string | null;
}

const DataExplorerTransactionModal: React.FC<DataExplorerAddressDetailModalProps> = (
  props
) => {
  const { closeHandler, address } = props;
  const [data, setData] = useState<DataExplorerAddressBalance | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const transaction = hasValue(address)
          ? await fetchAddressDetail(address)
          : null;
        setData(transaction);
        setActivePage(0);
        setIsFetching(false);
      } catch (e) {
        setIsFetching(false);
        setData(null);
      }
    };
    fetchData();
  }, [address]);
  return (
    <Modal
      show={address ? true : false}
      onHide={closeHandler}
      backdrop="static"
      keyboard={false}
      size="xl"
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-success">Address Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isFetching ? (
          <LoaderMask />
        ) : data ? (
          <div className="container">
            <Table hover>
              <tbody className="text-secondary">
                <tr className="row">
                  <td className="col-4">Address</td>
                  <td className="col-8">{address}</td>
                </tr>
                <tr className="row">
                  <td className="col-4">Transactions</td>
                  <td className="col-8">{data.n_tx}</td>
                </tr>
                <tr className="row">
                  <td className="col-4">Total Received</td>
                  <td className="col-8">
                    {formatNumberToBitcoin(data.total_received)}
                  </td>
                </tr>
                <tr className="row">
                  <td className="col-4">Total Sent</td>
                  <td className="col-8">
                    {formatNumberToBitcoin(
                      data.total_received - data.final_balance
                    )}
                  </td>
                </tr>
                <tr className="row">
                  <td className="col-4">Final Balance</td>
                  <td className="col-8">
                    {formatNumberToBitcoin(data.final_balance)}
                  </td>
                </tr>
              </tbody>
            </Table>
            <div className="container">
              <div className="row d-flex justify-content-center">
                <Pagination
                  totalPages={Math.ceil((data?.txs ? data.txs.length : 0) / 10)}
                  value={activePage}
                  onChange={({ target: { value } }) => setActivePage(value)}
                />
              </div>
              {data.txs
                ?.slice(activePage * 10, activePage * 10 + 9)
                .map((tx) => (
                  <DataExplorerBlockTransactionCard tx={tx} />
                ))}
              <div className="row d-flex justify-content-center">
                <Pagination
                  totalPages={Math.ceil((data?.txs ? data.txs.length : 0) / 10)}
                  value={activePage}
                  onChange={({ target: { value } }) => setActivePage(value)}
                />
              </div>
            </div>
          </div>
        ) : (
          <div>Could not fetch data.</div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DataExplorerTransactionModal;
