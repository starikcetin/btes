import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'react-bootstrap';
import LoaderMask from '../LoaderMask/LoaderMask';
import { formatTimestampForTimeInput } from '../../utils/formatTimestampForTimeInput';
import { formatNumberToBitcoin } from '../../utils/formatNumberToBitcoin';
import { AddressBalance, fetchAddressDetail } from '../../apis/AddressAPI';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const transaction = await fetchAddressDetail(address);
        setData(transaction);
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
      size="lg"
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title className="text-success">Address Detail</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isFetching ? (
          <LoaderMask />
        ) : data ? (
          <div className="container d-flex justify-content-center">
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
          </div>
        ) : (
          <div>Data couldnt downloaded</div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DataExplorerTransactionModal;
