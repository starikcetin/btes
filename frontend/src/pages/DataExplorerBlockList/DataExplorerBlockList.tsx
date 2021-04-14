import React, { useEffect, useState } from 'react';
import { Table } from 'react-bootstrap';
import './DataExplorerBlockList.scss';
import LoaderMask from '../../components/LoaderMask/LoaderMask';
import {
  BlockList,
  fetchBlockList,
} from '../../services/explorer/BlockListAPI';
import { formatTimestampForTimeInput } from '../../utils/formatTimestampForTimeInput';
import { Link, useParams } from 'react-router-dom';
import DataExplorerBlockModal from '../../components/explorer/DataExplorerBlockModal/DataExplorerBlockModal';

interface DataExplorerBlockListParams {
  isFull: string;
}

const DataExplorerBlockList: React.FC = () => {
  const { isFull } = useParams<DataExplorerBlockListParams>();
  const [data, setData] = useState<BlockList[] | null>(null);
  const [isFetching, setIsFetching] = useState<boolean>(false);
  const [viewingBlock, setViewingBlock] = useState<number | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsFetching(true);
        const blockList = await fetchBlockList();
        setData(blockList);
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
    <div className="page-data-explorer-block-list container">
      <DataExplorerBlockModal
        closeHandler={() => setViewingBlock(null)}
        blockHeight={viewingBlock}
      />
      {isFetching ? (
        <LoaderMask></LoaderMask>
      ) : (
        <div>
          <div>
            <span className="h4 text-info d-block">Latest Blocks</span>
            <span className="text-secondary d-block small">
              The most recently mined blocks
            </span>
          </div>
          {data ? (
            <div>
              <Table hover className="page-data-explorer-block-list--table p-1">
                <thead>
                  <tr className="page-data-explorer-block-list--table-header-row row">
                    <th className="col-2">Height</th>
                    <th className="col-4">Hash</th>
                    <th className="col-2">Tx Count</th>
                    <th className="col-4">Time</th>
                  </tr>
                </thead>
                <tbody>
                  {isFull
                    ? data?.map((block) => (
                        <tr
                          className="row page-data-explorer-block-list--table-body-row"
                          key={block.burn_block_height}
                          onClick={() => {
                            setViewingBlock(block.burn_block_height);
                          }}
                        >
                          <td className="col-2">{block.burn_block_height}</td>
                          <td className="col-4 text-truncate">{block.hash}</td>
                          <td className="col-2">{block.txs.length}</td>
                          <td className="col-4 text-truncate">
                            {formatTimestampForTimeInput(block.burn_block_time)}
                          </td>
                        </tr>
                      ))
                    : data?.slice(0, 6).map((block) => (
                        <tr
                          className="row page-data-explorer-block-list--table-body-row"
                          key={block.burn_block_height}
                          onClick={() => {
                            setViewingBlock(block.burn_block_height);
                          }}
                        >
                          <td className="col-2">{block.burn_block_height}</td>
                          <td className="col-4 text-truncate">{block.hash}</td>
                          <td className="col-2">{block.txs.length}</td>
                          <td className="col-4 text-truncate">
                            {formatTimestampForTimeInput(block.burn_block_time)}
                          </td>
                        </tr>
                      ))}
                </tbody>
              </Table>
              {isFull ? (
                <></>
              ) : (
                <Link
                  to="/explorer-blocks/full"
                  className="btn btn-outline-primary mb-3"
                >
                  All Blocks
                </Link>
              )}
            </div>
          ) : (
            <span className="alert-danger">
              Block List Couldn't Downloaded!
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default DataExplorerBlockList;
