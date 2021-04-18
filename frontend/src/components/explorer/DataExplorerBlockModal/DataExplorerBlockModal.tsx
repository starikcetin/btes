import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'react-bootstrap';
import Pagination from '@vlsergey/react-bootstrap-pagination';

import { fetchSingleBlockWithHeight } from '../../../services/explorer/SingleBlockAPI';
import LoaderMask from '../../LoaderMask/LoaderMask';
import DataExplorerBlockDetailTable from '../DataExplorerBlockDetailTable/DataExplorerBlockDetailTable';
import DataExplorerBlockTransactionCard from '../DataExplorerBlockTransactionCard/DataExplorerBlockTransactionCard';
import { hasValue } from '../../../common/utils/hasValue';
import { DataExplorerBlockWithTransactions } from '../../../services/explorer/data/block/DataExplorerBlockWithTransactions';

interface DataExplorerBlockModalProps {
  closeHandler: () => void;
  blockHeight: number | null;
}

const DataExplorerBlockModal: React.FC<DataExplorerBlockModalProps> = (
  props
) => {
  const { closeHandler, blockHeight } = props;
  const [data, setData] = useState<DataExplorerBlockWithTransactions | null>(
    null
  );
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<number>(0);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const block = hasValue(blockHeight)
          ? await fetchSingleBlockWithHeight(blockHeight)
          : null;
        setData(block);
        setActivePage(0);
        setIsFetching(false);
      } catch (e) {
        setIsFetching(false);
        setData(null);
      }
    };
    fetchData();
  }, [blockHeight]);

  return (
    <Modal
      show={blockHeight ? true : false}
      onHide={closeHandler}
      backdrop="static"
      keyboard={false}
      size="xl"
      scrollable
    >
      <Modal.Header closeButton>
        <Modal.Title>Blok {blockHeight}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isFetching ? (
          <LoaderMask />
        ) : data ? (
          <div>
            <DataExplorerBlockDetailTable data={data} />
            <div className="h4">Block Transactions</div>
            <div className="row d-flex justify-content-center">
              <Pagination
                totalPages={Math.ceil((data?.tx ? data.tx.length : 0) / 10)}
                value={activePage}
                onChange={({ target: { value } }) => setActivePage(value)}
              />
            </div>

            <Table hover borderless>
              <tbody>
                {data.tx
                  .slice(activePage * 10, activePage * 10 + 9)
                  .map((tx) => (
                    <tr key={tx.hash}>
                      <DataExplorerBlockTransactionCard tx={tx} />
                    </tr>
                  ))}
              </tbody>
            </Table>

            <div className="row d-flex justify-content-center">
              <Pagination
                totalPages={Math.ceil((data?.tx ? data.tx.length : 0) / 10)}
                value={activePage}
                onChange={({ target: { value } }) => setActivePage(value)}
              />
            </div>
          </div>
        ) : (
          <div>Data couldnt downloaded</div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DataExplorerBlockModal;
