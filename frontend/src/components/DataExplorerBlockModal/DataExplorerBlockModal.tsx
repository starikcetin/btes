import React, { useEffect, useState } from 'react';
import { Modal, Table } from 'react-bootstrap';
import {
  Block,
  fetchSingleBlockWithHeight,
} from '../../services/explorer/SingleBlockAPI';
import LoaderMask from '../LoaderMask/LoaderMask';
import DataExplorerBlockDetailTable from '../DataExplorerBlockDetailTable/DataExplorerBlockDetailTable';
import DataExplorerBlockTransactionCard from '../DataExplorerBlockTransactionCard/DataExplorerBlockTransactionCard';
import Pagination from '@material-ui/lab/Pagination';

interface DataExplorerBlockModalProps {
  closeHandler: () => void;
  blockHeight: number | null;
}

const DataExplorerBlockModal: React.FC<DataExplorerBlockModalProps> = (
  props
) => {
  const { closeHandler, blockHeight } = props;
  const [data, setData] = useState<Block | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [activePage, setActivePage] = useState<number>(1);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const block = await fetchSingleBlockWithHeight(blockHeight);
        setData(block);
        setActivePage(1);
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
                count={Math.ceil((data?.tx ? data.tx.length : 0) / 10)}
                color="primary"
                variant="outlined"
                size="large"
                page={activePage}
                onChange={(e, value) => setActivePage(value)}
                showFirstButton
                showLastButton
              />
            </div>

            <Table hover borderless>
              <tbody>
                {data.tx
                  .slice((activePage - 1) * 10, (activePage - 1) * 10 + 9)
                  .map((tx) => (
                    <tr key={tx.hash}>
                      <DataExplorerBlockTransactionCard tx={tx} />
                    </tr>
                  ))}
              </tbody>
            </Table>

            <div className="row d-flex justify-content-center">
              <Pagination
                count={Math.ceil((data?.tx ? data.tx.length : 0) / 10)}
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
        ) : (
          <div>Data couldnt downloaded</div>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default DataExplorerBlockModal;
