import React, { useEffect, useState } from 'react';
import { Modal } from 'react-bootstrap';
import LoaderMask from '../../LoaderMask/LoaderMask';
import DataExplorerBlockTransactionCard from '../DataExplorerBlockTransactionCard/DataExplorerBlockTransactionCard';
import { fetchSingleTransactionWithHash } from '../../../services/explorer/SingleTransactionAPI';
import DataExplorerTransactionDetailTable from '../DataExplorerTransactionDetailTable/DataExplorerTransactionDetailTable';
import DataExplorerTransactionInputOutputDetail from '../DataExplorerTransactionInputOutputDetail/DataExplorerTransactionInputOutputDetail';
import { hasValue } from '../../../common/utils/hasValue';
import { DataExplorerTransaction } from '../../../services/explorer/data/transaction/DataExplorerTransaction';

interface DataExplorerTransactionModalProps {
  closeHandler: () => void;
  transactionHash: string | null;
}

const DataExplorerTransactionModal: React.FC<DataExplorerTransactionModalProps> = (
  props
) => {
  const { closeHandler, transactionHash } = props;
  const [data, setData] = useState<DataExplorerTransaction | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const transaction = hasValue(transactionHash)
          ? await fetchSingleTransactionWithHash(transactionHash)
          : null;
        setData(transaction);
        setIsFetching(false);
      } catch (e) {
        console.log(e);
        setIsFetching(false);
        setData(null);
      }
    };
    fetchData();
  }, [transactionHash]);
  return (
    <Modal
      show={transactionHash ? true : false}
      onHide={closeHandler}
      backdrop="static"
      keyboard={false}
      size="xl"
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title>Transaction {transactionHash}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isFetching ? (
          <LoaderMask />
        ) : data ? (
          <div>
            <DataExplorerBlockTransactionCard tx={data} />
            <DataExplorerTransactionDetailTable data={data} />
            <DataExplorerTransactionInputOutputDetail
              inputs={data.inputs}
              outputs={data.out}
            />
          </div>
        ) : (
          <div>Data couldnt downloaded</div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DataExplorerTransactionModal;
