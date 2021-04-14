import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'react-bootstrap';
import LoaderMask from '../LoaderMask/LoaderMask';
import { formatNumberToBitcoin } from '../../utils/formatNumberToBitcoin';
import {
  AddressBalance,
  fetchAddressDetail,
} from '../../services/explorer/AddressAPI';
import DataExplorerBlockTransactionCard from '../DataExplorerBlockTransactionCard/DataExplorerBlockTransactionCard';
import Pagination from '@material-ui/lab/Pagination';

interface DataExplorerAddressDetailModalProps {
  closeHandler: () => void;
  address: string | null;
}

const DataExplorerTransactionModal: React.FC<DataExplorerAddressDetailModalProps> = (
  props
) => {
  const { closeHandler, address } = props;
  const [data, setData] = useState<AddressBalance | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const transaction = await fetchAddressDetail(address);
        setData(transaction);
        setActivePage(1);
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
                  count={Math.ceil((data?.txs ? data.txs.length : 0) / 10)}
                  color="primary"
                  variant="outlined"
                  size="large"
                  page={activePage}
                  onChange={(e, value) => setActivePage(value)}
                  showFirstButton
                  showLastButton
                />
              </div>
              {data.txs
                ?.slice((activePage - 1) * 10, (activePage - 1) * 10 + 9)
                .map((tx) => (
                  <DataExplorerBlockTransactionCard tx={tx} />
                ))}
              <div className="row d-flex justify-content-center">
                <Pagination
                  count={Math.ceil((data?.txs ? data.txs.length : 0) / 10)}
                  color="primary"
                  variant="outlined"
                  size="large"
                  page={activePage}
                  onChange={(e, value) => setActivePage(value)}
                  showFirstButton
                  showLastButton
                />
              </div>
            </div>
          </div>
        ) : (
          <div>Data couldnt downloaded</div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DataExplorerTransactionModal;
