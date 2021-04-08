import React, { useEffect, useState } from 'react';
import { BlockList, fetchBlockList } from '../../apis/BlockListAPI';
import { Modal, Table } from 'react-bootstrap';
import LogTable from '../LogTable/LogTable';
import { Block, fetchSingleBlockWithHeight } from '../../apis/SingleBlockAPI';
import LoaderMask from '../LoaderMask/LoaderMask';
import DataExplorerBlockTable from '../DataExplorerBlockTable/DataExplorerBlockTable';
import DataExplorerBlockTransactionCard from '../DataExplorerBlockTransactionCard/DataExplorerBlockTransactionCard';

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

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const block = await fetchSingleBlockWithHeight(blockHeight);
        console.log(block);
        setData(block);
        setIsFetching(false);
      } catch (e) {
        console.log(e);
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
            <DataExplorerBlockTable data={data} />
            <div className="h4">Block Transactions</div>
            <Table hover borderless>
              <tbody>
                {data.tx.slice(0, 10).map((tx) => (
                  <tr>
                    <DataExplorerBlockTransactionCard tx={tx} />
                  </tr>
                ))}
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

export default DataExplorerBlockModal;
